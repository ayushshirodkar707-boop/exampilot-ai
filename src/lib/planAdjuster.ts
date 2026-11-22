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
