export interface HintExample {
  subject: 'Math' | 'Science'
  grade: number
  question: string
  level: 1 | 2 | 3
  good: string
  bad: string
  badReason: string
}

export const hintExamples: HintExample[] = [
  // ─────────── MATH ───────────
  { subject: 'Math', grade: 1, question: 'What is 20 + 10?', level: 1,
    good: 'What do you get when you count up 10 more from 20?',
    bad: 'The answer is 30.', badReason: 'States the answer outright' },
  { subject: 'Math', grade: 1, question: 'What is 20 + 10?', level: 2,
    good: '20 is 2 tens, and 10 is 1 ten. Try putting the tens together.',
    bad: "20+10 means adding the tens place: 2+1=3, so it's 30.", badReason: 'Walks through their exact calculation to the answer' },
  { subject: 'Math', grade: 1, question: 'What is 20 + 10?', level: 3,
    good: 'Try 30+10 first: 3 tens plus 1 ten = 4 tens = 40. Now try yours the same way.',
    bad: "Let's try 20+10 together: 2 tens plus 1 ten = 3 tens = 30.", badReason: 'Worked example uses their exact numbers, not a different one' },

  { subject: 'Math', grade: 2, question: 'What is 45 − 18?', level: 1,
    good: 'Have you tried a number line, or subtracting with borrowing on paper?',
    bad: "Just subtract 18 from 45 and you'll get it.", badReason: 'Restates the problem, adds no real guidance' },
  { subject: 'Math', grade: 2, question: 'What is 45 − 18?', level: 2,
    good: "Since 5 is smaller than 8, you'll need to borrow a ten before subtracting.",
    bad: 'Borrow a ten: 15−8=7, then 3−1=2, giving 27.', badReason: 'Computes their exact answer' },
  { subject: 'Math', grade: 2, question: 'What is 45 − 18?', level: 3,
    good: 'Try 52−27: borrow a ten, 12−7=5, then 4−2=2, so 25. Now try yours.',
    bad: 'For yours: 45−18 = 27, step by step...', badReason: 'Uses their exact problem as the "example"' },

  { subject: 'Math', grade: 3, question: 'What is 6 × 7?', level: 1,
    good: 'Do you know any nearby facts, like 6×6 or 5×7?',
    bad: "It's 42, easy!", badReason: 'Gives the answer, dismissive tone on top' },
  { subject: 'Math', grade: 3, question: 'What is 6 × 7?', level: 2,
    good: '6×7 means adding 6 together 7 times — or 7 together 6 times.',
    bad: '6×7 = 6×5 + 6×2 = 30+12 = 42.', badReason: 'Full computation to their answer' },
  { subject: 'Math', grade: 3, question: 'What is 6 × 7?', level: 3,
    good: 'Try 8×4: 8+8+8+8 = 32. Now build yours the same way.',
    bad: 'For 6×7: 6+6+6+6+6+6+6 = 42.', badReason: 'Their exact numbers, not a fresh example' },

  { subject: 'Math', grade: 4, question: 'What is 84 ÷ 7?', level: 1,
    good: 'What number times 7 gets close to 84?',
    bad: '84 divided by 7 is 12.', badReason: 'States the answer' },
  { subject: 'Math', grade: 4, question: 'What is 84 ÷ 7?', level: 2,
    good: 'Try breaking 84 into 70+14 — both divide evenly by 7.',
    bad: '70÷7=10, 14÷7=2, so 10+2=12.', badReason: 'Computed to the answer' },
  { subject: 'Math', grade: 4, question: 'What is 84 ÷ 7?', level: 3,
    good: 'Try 96÷8: split into 80+16 → 10+2=12. Now split yours the same way.',
    bad: 'For 84÷7: 70+14 → 10+2=12.', badReason: 'Their exact problem as the "example"' },

  { subject: 'Math', grade: 5, question: 'What is 1/2 + 1/4?', level: 1,
    good: 'Can these be added directly, or do they need something first?',
    bad: 'You need a common denominator, then add numerators: 3/4.', badReason: 'Gives the full method and the answer in one line' },
  { subject: 'Math', grade: 5, question: 'What is 1/2 + 1/4?', level: 2,
    good: 'These have different denominators — what number do both 2 and 4 divide into?',
    bad: '1/2 = 2/4, and 2/4+1/4 = 3/4.', badReason: 'Computed to the answer' },
  { subject: 'Math', grade: 5, question: 'What is 1/2 + 1/4?', level: 3,
    good: 'Try 1/3+1/6: rewrite 1/3 as 2/6, then 2/6+1/6=3/6=1/2. Now try yours.',
    bad: 'For yours: 1/2=2/4, so 2/4+1/4=3/4.', badReason: 'Their exact fractions' },

  { subject: 'Math', grade: 6, question: 'Area of a rectangle, length 8 cm, width 5 cm', level: 1,
    good: 'Do you remember the formula connecting length and width to area?',
    bad: 'Multiply the two numbers together.', badReason: 'Skips the recall step L1 exists for' },
  { subject: 'Math', grade: 6, question: 'Area of a rectangle, length 8 cm, width 5 cm', level: 2,
    good: 'Area = length × width. You have both — what would you do with them?',
    bad: 'Area = 8×5 = 40 sq cm.', badReason: 'Computed' },
  { subject: 'Math', grade: 6, question: 'Area of a rectangle, length 8 cm, width 5 cm', level: 3,
    good: 'Try length 6, width 3: 6×3=18 sq cm. Now use the formula on yours.',
    bad: 'For yours: 8×5 = 40 sq cm.', badReason: 'Their exact numbers' },

  { subject: 'Math', grade: 7, question: 'Solve for x: 3x + 5 = 20', level: 1,
    good: "What's the first thing you'd remove from both sides?",
    bad: 'Subtract 5, then divide by 3.', badReason: 'Gives the full method for their exact equation' },
  { subject: 'Math', grade: 7, question: 'Solve for x: 3x + 5 = 20', level: 2,
    good: 'Move the +5 to the other side first. Then think about the 3 next to x.',
    bad: '3x+5=20 → 3x=15 → x=5.', badReason: 'Computed to the answer' },
  { subject: 'Math', grade: 7, question: 'Solve for x: 3x + 5 = 20', level: 3,
    good: 'Try 2x+3=11: subtract 3 → 2x=8, divide by 2 → x=4. Now try yours.',
    bad: 'For yours: 3x+5=20 → 3x=15 → x=5.', badReason: 'Their exact equation' },

  { subject: 'Math', grade: 8, question: 'What is 25% of 80?', level: 1,
    good: 'Do you know another way to write 25% as a fraction?',
    bad: '25% is one-fourth, so divide 80 by 4.', badReason: 'Full method for their exact numbers' },
  { subject: 'Math', grade: 8, question: 'What is 25% of 80?', level: 2,
    good: '25% simplifies to 1/4. What operation turns 80 into a quarter of itself?',
    bad: '25% of 80 = 1/4×80 = 20.', badReason: 'Computed' },
  { subject: 'Math', grade: 8, question: 'What is 25% of 80?', level: 3,
    good: 'Try 25% of 60: that\'s 15. Now use the same idea on your number.',
    bad: 'For yours: 25% of 80 = 20.', badReason: 'Their exact numbers' },

  { subject: 'Math', grade: 9, question: 'Hypotenuse of a right triangle, legs 3 and 4', level: 1,
    good: 'What theorem connects the three sides of a right triangle?',
    bad: 'Use a²+b²=c², plug in 3 and 4.', badReason: 'Mixes Level 2 content into Level 1' },
  { subject: 'Math', grade: 9, question: 'Hypotenuse of a right triangle, legs 3 and 4', level: 2,
    good: 'a²+b²=c² for a right triangle. You have both legs — what next?',
    bad: '3²+4²=9+16=25, so c=5.', badReason: 'Computed' },
  { subject: 'Math', grade: 9, question: 'Hypotenuse of a right triangle, legs 3 and 4', level: 3,
    good: 'Try legs 6 and 8: 36+64=100, √100=10. Now try yours.',
    bad: 'For yours: 3²+4²=25, c=5.', badReason: 'Their exact numbers' },

  { subject: 'Math', grade: 10, question: 'Factor x² + 5x + 6', level: 1,
    good: 'What two numbers multiply to the last term and add to the middle one?',
    bad: 'You need two numbers that multiply to 6 and add to 5 — those are 2 and 3.', badReason: 'Answers the sub-question for their exact problem' },
  { subject: 'Math', grade: 10, question: 'Factor x² + 5x + 6', level: 2,
    good: 'For x²+bx+c, list factor pairs of c that also add to b.',
    bad: '2 and 3 multiply to 6, add to 5, so (x+2)(x+3).', badReason: 'Computed' },
  { subject: 'Math', grade: 10, question: 'Factor x² + 5x + 6', level: 3,
    good: 'Try x²+7x+12: need numbers multiplying to 12, adding to 7 → 3 and 4 → (x+3)(x+4). Now try yours.',
    bad: 'For yours: (x+2)(x+3).', badReason: 'Their exact problem' },

  // ─────────── SCIENCE ───────────
  { subject: 'Science', grade: 1, question: 'Which of these are living things: a rock, a plant, a car, a dog?', level: 1,
    good: 'What do living things usually need, like food or water? Do all four need that?',
    bad: 'The living things are the plant and the dog.', badReason: 'States the answer directly' },
  { subject: 'Science', grade: 1, question: 'Which of these are living things: a rock, a plant, a car, a dog?', level: 2,
    good: 'Living things grow, breathe, and need food. Check each of the four against that.',
    bad: "A rock and car don't grow or eat, but a plant and dog do — so those two are living.", badReason: 'Explains straight through to the answer' },
  { subject: 'Science', grade: 1, question: 'Which of these are living things: a rock, a plant, a car, a dog?', level: 3,
    good: "Think about a fish: does it grow, does it need food? Yes to both, so it's living. Now check your four the same way.",
    bad: 'For yours: the plant grows and needs water, the dog breathes and eats — so those two are living.', badReason: 'Uses their exact four objects, not a fresh example' },

  { subject: 'Science', grade: 2, question: 'Name the five senses we use to explore the world.', level: 1,
    good: 'What part of your body do you use to see, or to smell something?',
    bad: 'The five senses are sight, hearing, smell, taste, and touch.', badReason: 'Gives the full list immediately' },
  { subject: 'Science', grade: 2, question: 'Name the five senses we use to explore the world.', level: 2,
    good: 'Think about your eyes, ears, nose, tongue, and skin — what does each one let you do?',
    bad: "Eyes give sight, ears hearing, nose smell, tongue taste, skin touch — that's all five.", badReason: 'Fully names and matches all five' },
  { subject: 'Science', grade: 2, question: 'Name the five senses we use to explore the world.', level: 3,
    good: 'If I ask what tells you food tastes sweet, that\'s your tongue — taste. Now think through the other four the same way.',
    bad: 'For yours: eyes=sight, ears=hearing, nose=smell, tongue=taste, skin=touch.', badReason: 'Solves their exact list instead of demonstrating with one new sense' },

  { subject: 'Science', grade: 3, question: 'Why do plants need sunlight?', level: 1,
    good: 'What do you think plants might make using sunlight?',
    bad: 'Plants need sunlight to make their own food through photosynthesis.', badReason: 'Names the exact process' },
  { subject: 'Science', grade: 3, question: 'Why do plants need sunlight?', level: 2,
    good: "Plants use sunlight, water, and air to make their own food — what's that process called?",
    bad: 'Sunlight lets plants photosynthesize, turning water and carbon dioxide into food.', badReason: 'Fully explains the mechanism and names it' },
  { subject: 'Science', grade: 3, question: 'Why do plants need sunlight?', level: 3,
    good: 'You need food for energy to grow — plants need energy too, made using sunlight. Now think about what they specifically make with it.',
    bad: 'For your question: sunlight lets plants photosynthesize, making the food they need to grow.', badReason: 'Answers their exact question instead of a parallel case' },

  { subject: 'Science', grade: 4, question: 'What are the three states of matter?', level: 1,
    good: "Think of ice, water, and steam — what's different about each one?",
    bad: 'The three states of matter are solid, liquid, and gas.', badReason: 'States the answer' },
  { subject: 'Science', grade: 4, question: 'What are the three states of matter?', level: 2,
    good: "One holds its shape, one takes its container's shape, one spreads to fill any space. What might those be called?",
    bad: 'Solid keeps shape, liquid takes container shape, gas spreads out — the three states.', badReason: 'Names all three directly' },
  { subject: 'Science', grade: 4, question: 'What are the three states of matter?', level: 3,
    good: 'Butter is solid, melted butter is liquid, its steam while cooking is gas. Now think about water the same way.',
    bad: 'For yours: ice is solid, water is liquid, steam is gas.', badReason: 'Solves their exact water example' },

  { subject: 'Science', grade: 5, question: 'Why does the moon appear to change shape through the month?', level: 1,
    good: 'Does the moon actually change shape, or does what we see of it change?',
    bad: "The moon doesn't change shape — we just see different amounts of its lit side as it orbits Earth.", badReason: 'Gives the full explanation immediately' },
  { subject: 'Science', grade: 5, question: 'Why does the moon appear to change shape through the month?', level: 2,
    good: 'As the moon orbits Earth, how much of its sunlit side faces us changes. What might that be called?',
    bad: 'We see different portions of its sunlit half as it orbits — these are called phases.', badReason: 'Explains and names the concept fully' },
  { subject: 'Science', grade: 5, question: 'Why does the moon appear to change shape through the month?', level: 3,
    good: "Picture a ball lit by a flashlight from one side — walking around it, you'd see different amounts of the lit part. Now apply that to the moon.",
    bad: 'For the moon: as it orbits, we see different amounts of its lit half, which is why it looks like it changes shape.', badReason: 'Applies the reasoning directly to their exact question' },

  { subject: 'Science', grade: 6, question: 'Why does a ball bounce back after hitting the ground?', level: 1,
    good: "What happens to the ball's shape for a tiny moment when it hits the ground?",
    bad: 'The ball bounces back due to the ground pushing back on it — Newton\'s third law.', badReason: 'Names the governing law directly' },
  { subject: 'Science', grade: 6, question: 'Why does a ball bounce back after hitting the ground?', level: 2,
    good: 'The squished ball stores energy on impact — what happens to that energy right after?',
    bad: 'The ball compresses, storing elastic potential energy, which is released to push it back up.', badReason: 'Fully explains the mechanism' },
  { subject: 'Science', grade: 6, question: 'Why does a ball bounce back after hitting the ground?', level: 3,
    good: 'A stretched rubber band snaps back when released — stored energy converting to movement. Now think about the ball the same way.',
    bad: 'For your ball: it compresses, stores energy, then releases it to bounce back up.', badReason: 'Solves their exact ball scenario' },

  { subject: 'Science', grade: 7, question: 'Why do we sweat more on a hot day?', level: 1,
    good: 'What do you think your body is trying to do when it releases sweat?',
    bad: 'You sweat more on hot days because your body is cooling itself through evaporation.', badReason: 'States the mechanism directly' },
  { subject: 'Science', grade: 7, question: 'Why do we sweat more on a hot day?', level: 2,
    good: 'Sweat evaporating from skin takes heat away with it — how might that connect to hot days?',
    bad: 'On hot days your body produces more sweat so more evaporation cools you faster.', badReason: 'Fully connects cause to effect' },
  { subject: 'Science', grade: 7, question: 'Why do we sweat more on a hot day?', level: 3,
    good: 'Wet clothes feel cold as they dry — evaporation pulling heat away. Now connect that to sweating on a hot day.',
    bad: 'For sweating on hot days: more sweat means more evaporation, which removes more heat.', badReason: 'Applies the idea directly to their question' },

  { subject: 'Science', grade: 8, question: "Why does iron rust but gold doesn't?", level: 1,
    good: 'What do you think iron is reacting with in the air to form rust?',
    bad: 'Iron rusts because it reacts with oxygen and moisture, while gold is unreactive.', badReason: 'States the full answer' },
  { subject: 'Science', grade: 8, question: "Why does iron rust but gold doesn't?", level: 2,
    good: 'Rust forms when a metal reacts with oxygen and water. Some metals react easily, others barely react — where might iron and gold fall?',
    bad: 'Iron reacts readily with oxygen and water to form iron oxide; gold is chemically unreactive.', badReason: 'Fully explains and names the compound' },
  { subject: 'Science', grade: 8, question: "Why does iron rust but gold doesn't?", level: 3,
    good: 'Sodium reacts violently in water while platinum barely reacts at all — metals differ hugely in reactivity. Now think about where iron and gold fall on that scale.',
    bad: 'For iron vs gold: iron is reactive and rusts, gold is unreactive and doesn\'t.', badReason: 'Answers their exact comparison instead of a separate one' },

  { subject: 'Science', grade: 9, question: "Why doesn't a heavier object necessarily fall faster than a lighter one?", level: 1,
    good: 'Have you heard of the famous experiment testing whether weight affects falling speed?',
    bad: 'Objects fall at the same rate regardless of mass — gravity accelerates everything equally.', badReason: 'States the key finding directly' },
  { subject: 'Science', grade: 9, question: "Why doesn't a heavier object necessarily fall faster than a lighter one?", level: 2,
    good: "Gravity accelerates every object equally — what's the one other force that could make things fall differently in real life?",
    bad: 'All objects accelerate equally due to gravity; only air resistance, based on shape, causes different real-world fall speeds.', badReason: 'Fully explains the exception too' },
  { subject: 'Science', grade: 9, question: "Why doesn't a heavier object necessarily fall faster than a lighter one?", level: 3,
    good: 'Pushing a brick-shaped box and a flat board through water at the same speed — the flat one feels far more resistance. Now think about why air might act similarly on falling objects of different shapes.',
    bad: 'For your comparison: in a vacuum they\'d fall together, but in air, resistance affects them differently based on shape.', badReason: 'Answers their exact scenario, not a separate parallel one' },

  { subject: 'Science', grade: 10, question: 'Why does a concave mirror form a real image for a distant object but a virtual one for a nearby object?', level: 1,
    good: "Where does the object sit relative to the mirror's focal point in each case?",
    bad: 'It depends on whether the object is beyond or within the focal length.', badReason: 'States the governing rule directly' },
  { subject: 'Science', grade: 10, question: 'Why does a concave mirror form a real image for a distant object but a virtual one for a nearby object?', level: 2,
    good: 'Think about how reflected rays behave differently when an object is beyond the focal point versus between it and the mirror.',
    bad: 'Beyond the focal point, rays converge to a real image; within it, they diverge, forming a virtual upright image.', badReason: 'Fully explains both cases to their conclusions' },
  { subject: 'Science', grade: 10, question: 'Why does a concave mirror form a real image for a distant object but a virtual one for a nearby object?', level: 3,
    good: 'A convex lens forms a real image on the far side for a distant object, but up close it acts like a magnifying glass instead. Now think about why distance from the focal point matters for your mirror too.',
    bad: 'For your mirror: beyond focal point → real inverted image; within it → virtual upright image, like a magnifying mirror.', badReason: 'Solves their exact mirror question' },
]

// Picks the most relevant examples for a given request: same subject, same level,
// closest grade first. Returns a small set — not the whole bank — so the prompt
// stays focused and doesn't burn tokens on irrelevant grade levels.
export function selectExamples(
  subject: 'Math' | 'Science',
  level: 1 | 2 | 3,
  grade: number,
  count = 2
): HintExample[] {
  return hintExamples
    .filter((ex) => ex.subject === subject && ex.level === level)
    .sort((a, b) => Math.abs(a.grade - grade) - Math.abs(b.grade - grade))
    .slice(0, count)
}

// Formats selected examples into text ready to drop into a system prompt
export function formatExamplesForPrompt(examples: HintExample[]): string {
  return examples
    .map(
      (ex, i) =>
        `Example ${i + 1} (Question: "${ex.question}"):\nGOOD hint: "${ex.good}"\nBAD hint (avoid this pattern): "${ex.bad}" — ${ex.badReason}`
    )
    .join('\n\n')
}