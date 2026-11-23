import type { StudyPlan, Chapter } from '@/types';

function cleanName(name: string): string {
  return name.replace(/^[^:]+:\s*/, '').trim().toLowerCase();
}

/**
 * Intelligently adjusts the study plan when a chapter's status changes in the Syllabus Tracker.
 */
export function adjustPlanForChapter(
  plan: StudyPlan,
  chapterName: string,
  subject: string,
  newStatus: Chapter['status']
): StudyPlan {
  if (!plan || !plan.weeks) return plan;

  const targetClean = cleanName(chapterName);
  const cloned: StudyPlan = JSON.parse(JSON.stringify(plan));
  let modified = false;

  if (newStatus === 'completed') {
    // 1. If completed: future uncompleted blocks for this topic become active revision/PYQs
    cloned.weeks.forEach((w) => {
      w.days.forEach((day) => {
        ['morning', 'afternoon', 'evening'].forEach((slotKey) => {
          const block = (day.blocks as any)[slotKey];
          if (block && !block.completed) {
            const matchesTopic =
              block.topics?.some((t: string) => cleanName(t).includes(targetClean) || targetClean.includes(cleanName(t))) ||
              (block.actionItem && cleanName(block.actionItem).includes(targetClean));

            if (matchesTopic) {
              block.topics = [
                `${chapterName.replace(/^[^:]+:\s*/, '')} (Mastered)`,
                'High-Yield PYQ Speed Drill',
              ];
              block.actionItem = `Active Spaced Revision: 15-min formula flashcards + 25 timed PYQs for ${chapterName.replace(/^[^:]+:\s*/, '')} (Theory completed)`;
              modified = true;
            }
          }
        });
      });
    });

    // Add note to the first upcoming uncompleted day
    let noteAdded = false;
    for (const w of cloned.weeks) {
      for (const d of w.days) {
        if (!d.blocks.morning.completed && !d.blocks.evening.completed && !noteAdded) {
          d.dailyNote = `Plan adjusted: "${chapterName.replace(/^[^:]+:\s*/, '')}" marked completed; sessions updated to active recall & PYQ mastery.`;
          noteAdded = true;
          break;
        }
      }
      if (noteAdded) break;
    }
  } else if (newStatus === 'needs-revision') {
    // 2. If needs revision: inject into the nearest upcoming revision day or uncompleted evening block
    let injected = false;

    for (const w of cloned.weeks) {
      for (const d of w.days) {
        if (d.isRevisionDay && !d.blocks.evening.completed && !injected) {
          d.blocks.evening.topics = [
            `[Priority Revision] ${chapterName.replace(/^[^:]+:\s*/, '')}`,
            ...d.blocks.evening.topics.filter((t: string) => !t.includes(targetClean)),
          ];
          d.blocks.evening.actionItem = `Intensive Review: Solve 20 weak-spot PYQs & re-derive formulas for ${chapterName.replace(/^[^:]+:\s*/, '')}`;
          d.dailyNote = `Priority review scheduled for ${chapterName.replace(/^[^:]+:\s*/, '')} based on syllabus tracker.`;
          injected = true;
          modified = true;
          break;
        }
      }
      if (injected) break;
    }

    // If no revision day found, inject into the first upcoming evening review block
    if (!injected) {
      for (const w of cloned.weeks) {
        for (const d of w.days) {
          if (!d.blocks.evening.completed) {
            d.blocks.evening.topics = [
              `[Priority Revision] ${chapterName.replace(/^[^:]+:\s*/, '')}`,
              ...d.blocks.evening.topics,
            ];
            d.blocks.evening.actionItem = `Priority Review: Error log & tricky PYQs for ${chapterName.replace(/^[^:]+:\s*/, '')}`;
            d.dailyNote = `Priority revision scheduled for ${chapterName.replace(/^[^:]+:\s*/, '')}.`;
            injected = true;
            modified = true;
            break;
          }
        }
        if (injected) break;
      }
    }
  } else if (newStatus === 'in-progress') {
    // 3. If in progress: ensure earliest matching block focuses on core theory & examples
    let setInProgress = false;
    for (const w of cloned.weeks) {
      for (const d of w.days) {
        ['morning', 'afternoon', 'evening'].forEach((slotKey) => {
          const block = (daySlot: any) => (d.blocks as any)[daySlot];
          const b = block(slotKey);
          if (b && !b.completed && b.subject.toLowerCase() === subject.toLowerCase() && !setInProgress) {
            b.topics = [
              chapterName.replace(/^[^:]+:\s*/, ''),
              'Core Theory & Standard Problem Patterns',
            ];
            b.actionItem = `In-Depth Study: Master derivations & first 20 NCERT/textbook problems for ${chapterName.replace(/^[^:]+:\s*/, '')}`;
            setInProgress = true;
            modified = true;
          }
        });
        if (setInProgress) break;
      }
      if (setInProgress) break;
    }
  }

  return cloned;
}

/**
 * Recalibrates the study schedule after a missed study day.
 * Distributes uncompleted topics into upcoming study blocks or shifts dates so the student never falls behind.
 */
export function recalibrateForMissedDay(
  plan: StudyPlan,
  options: {
    missedDate?: string;
    strategy?: 'redistribute' | 'shift' | 'weekend';
  } = {}
): { success: boolean; plan: StudyPlan; message: string; missedTopicsCount: number } {
  if (!plan || !plan.weeks || plan.weeks.length === 0) {
    return { success: false, plan, message: 'No active plan available to adjust', missedTopicsCount: 0 };
  }

  const cloned: StudyPlan = JSON.parse(JSON.stringify(plan));
  const strategy = options.strategy || 'redistribute';
  const targetDate = options.missedDate || new Date().toISOString().slice(0, 10);

  // 1. Locate the missed day across all weeks
  let foundWeekIdx = -1;
  let foundDayIdx = -1;
  let missedDayRef: any = null;

  for (let wIdx = 0; wIdx < cloned.weeks.length; wIdx++) {
    for (let dIdx = 0; dIdx < cloned.weeks[wIdx].days.length; dIdx++) {
      const d = cloned.weeks[wIdx].days[dIdx];
      if (d.date === targetDate) {
        foundWeekIdx = wIdx;
        foundDayIdx = dIdx;
        missedDayRef = d;
        break;
      }
    }
    if (missedDayRef) break;
  }

  // If exact date match not found, find the earliest day with uncompleted tasks
  if (!missedDayRef) {
    for (let wIdx = 0; wIdx < cloned.weeks.length; wIdx++) {
      for (let dIdx = 0; dIdx < cloned.weeks[wIdx].days.length; dIdx++) {
        const d = cloned.weeks[wIdx].days[dIdx];
        if (!d.blocks.morning.completed || !d.blocks.afternoon.completed || !d.blocks.evening.completed) {
          foundWeekIdx = wIdx;
          foundDayIdx = dIdx;
          missedDayRef = d;
          break;
        }
      }
      if (missedDayRef) break;
    }
  }

  // Fallback to first day if still not found
  if (!missedDayRef) {
    foundWeekIdx = 0;
    foundDayIdx = 0;
    missedDayRef = cloned.weeks[0].days[0];
  }

  // 2. Extract uncompleted topics from the missed day
  const missedTopics: { subject: string; topic: string }[] = [];
  ['morning', 'afternoon', 'evening'].forEach((slot) => {
    const b = (missedDayRef.blocks as any)[slot];
    if (b && !b.completed) {
      (b.topics || []).forEach((t: string) => {
        if (!missedTopics.some((mt) => mt.topic === t)) {
          missedTopics.push({ subject: b.subject, topic: t });
        }
      });
    }
  });

  // If all blocks were marked complete or empty, pull default core topics for that day
  if (missedTopics.length === 0) {
    ['morning', 'afternoon', 'evening'].forEach((slot) => {
      const b = (missedDayRef.blocks as any)[slot];
      if (b && b.topics && b.topics.length > 0) {
        missedTopics.push({ subject: b.subject, topic: b.topics[0] });
      }
    });
  }

  const missedCount = missedTopics.length;

  // 3. Apply Catch-Up Strategy
  if (strategy === 'shift') {
    // Strategy B: Push calendar dates forward by 1 day from the missed day onwards
    missedDayRef.dailyNote = `[Buffer Rest Day]: Schedule shifted forward by 1 day to catch up.`;
    missedDayRef.blocks.morning.completed = true;
    missedDayRef.blocks.afternoon.completed = true;
    missedDayRef.blocks.evening.completed = true;

    // Shift subsequent day dates forward by 1 day
    let startShifting = false;
    for (const w of cloned.weeks) {
      for (const d of w.days) {
        if (startShifting) {
          try {
            const cur = new Date(d.date);
            if (!isNaN(cur.getTime())) {
              cur.setDate(cur.getDate() + 1);
              d.date = cur.toISOString().slice(0, 10);
            }
          } catch {}
        }
        if (d === missedDayRef) {
          startShifting = true;
        }
      }
    }

    return {
      success: true,
      plan: cloned,
      message: `Schedule successfully shifted forward by 1 day. Your calendar has adjusted automatically.`,
      missedTopicsCount: missedCount,
    };
  }

  if (strategy === 'weekend') {
    // Strategy C: Move missed topics to the nearest upcoming Revision Day or Sunday
    let absorbed = false;
    let targetRevisionDay: any = null;

    let passedMissedDay = false;
    for (const w of cloned.weeks) {
      for (const d of w.days) {
        if (passedMissedDay && (d.isRevisionDay || d.dayLabel.toLowerCase().includes('sun'))) {
          targetRevisionDay = d;
          break;
        }
        if (d === missedDayRef) passedMissedDay = true;
      }
      if (targetRevisionDay) break;
    }

    if (!targetRevisionDay && cloned.weeks[foundWeekIdx]?.days?.length > 0) {
      // Pick last day of current week
      const lastDay = cloned.weeks[foundWeekIdx].days[cloned.weeks[foundWeekIdx].days.length - 1];
      targetRevisionDay = lastDay;
    }

    if (targetRevisionDay) {
      missedTopics.forEach((mt) => {
        if (!targetRevisionDay.blocks.evening.topics.includes(mt.topic)) {
          targetRevisionDay.blocks.evening.topics.unshift(`[Catch-Up] ${mt.topic}`);
        }
      });
      targetRevisionDay.blocks.evening.actionItem = `Intensive Catch-Up: Master missed topics (${missedTopics.map(m => m.topic).slice(0, 2).join(', ')}) + timed PYQs.`;
      targetRevisionDay.dailyNote = `Catch-up session assigned for missed day topics.`;
      absorbed = true;
    }

    // Mark missed day as resolved
    missedDayRef.dailyNote = `[Missed Day]: Catch-up topics assigned to upcoming revision day.`;
    missedDayRef.blocks.morning.completed = true;
    missedDayRef.blocks.afternoon.completed = true;
    missedDayRef.blocks.evening.completed = true;

    return {
      success: true,
      plan: cloned,
      message: `Missed topics assigned to upcoming revision day buffer blocks.`,
      missedTopicsCount: missedCount,
    };
  }

  // Strategy A (Default): Dynamic Smart Redistribution across upcoming 3-5 days
  let topicIndex = 0;
  let daysModified = 0;
  let passedMissedDay = false;

  for (const w of cloned.weeks) {
    for (const d of w.days) {
      if (passedMissedDay && topicIndex < missedTopics.length && daysModified < 4) {
        const itemToInject = missedTopics[topicIndex];
        
        // Add to afternoon or evening block
        const targetBlock = !d.blocks.afternoon.completed ? d.blocks.afternoon : d.blocks.evening;
        if (!targetBlock.topics.some((t: string) => t.includes(itemToInject.topic))) {
          targetBlock.topics.push(`[Catch-Up] ${itemToInject.topic}`);
          targetBlock.duration = Math.min(180, targetBlock.duration + 20); // +20 min micro-sprint
          targetBlock.actionItem = `20-Min Catch-Up Sprint: Review key formulas & 10 PYQs for ${itemToInject.topic}`;
          d.dailyNote = `Recalibrated schedule: includes micro catch-up sprint for missed topics.`;
          topicIndex++;
          daysModified++;
        }
      }
      if (d === missedDayRef) {
        passedMissedDay = true;
      }
    }
  }

  // Mark missed day as recalibrated
  missedDayRef.dailyNote = `[Missed Day]: Topics redistributed across upcoming study blocks.`;
  missedDayRef.blocks.morning.completed = true;
  missedDayRef.blocks.afternoon.completed = true;
  missedDayRef.blocks.evening.completed = true;

  return {
    success: true,
    plan: cloned,
    message: `Schedule recalibrated! ${missedCount} missed topic(s) redistributed across the next ${Math.max(1, daysModified)} days.`,
    missedTopicsCount: missedCount,
  };
}
