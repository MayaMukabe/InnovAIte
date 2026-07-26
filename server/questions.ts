export const districtQuestions = {
  memory: [
    { prompt: 'Study: Comet, Lantern, Forest, Shell. Which came third?', answers: ['Comet', 'Forest', 'Shell', 'Lantern'], correct: 1, think: 'Turn the list into a quick picture-story.' },
    { prompt: 'Which pair appeared in both lists? A: Oak, Moon, Kite. B: Moon, Drum, Oak.', answers: ['Moon and Oak', 'Kite and Drum', 'Oak and Drum', 'Moon and Kite'], correct: 0, think: 'Check one item at a time against the second list.' },
  ],
  logic: [
    { prompt: 'A robot has 3 boxes with 4 gears each. How many gears?', answers: ['7', '10', '12', '14'], correct: 2, think: 'Model the boxes as equal groups.' },
    { prompt: 'If 2 machines make 8 parts, how many do 5 identical machines make?', answers: ['16', '18', '20', '24'], correct: 2, think: 'First find the number of parts per machine.' },
  ],
  reading: [
    { prompt: 'Maya packed an umbrella because dark clouds filled the sky. What can you infer?', answers: ['It may rain', 'It is nighttime', 'She is traveling', 'It is snowing'], correct: 0, think: 'Connect the clue to what usually happens next.' },
    { prompt: 'Leo whispered and closed the door gently. What does this suggest?', answers: ['Someone may be sleeping', 'He is angry', 'The door is broken', 'He is outside'], correct: 0, think: 'Ask why someone would reduce both sound and movement.' },
  ],
  creativity: [
    { prompt: 'Which sentence makes “The bird flew” most vivid?', answers: ['The bird was there', 'The scarlet bird soared above silver clouds', 'A bird flew', 'It moved'], correct: 1, think: 'Look for details that create a clear mental picture.' },
    { prompt: 'Which object could be redesigned to solve two problems at once?', answers: ['A bottle that filters water and tracks refills', 'A plain rock', 'An empty box', 'A short string'], correct: 0, think: 'Find the idea with two useful jobs.' },
  ],
  curiosity: [
    { prompt: 'Which question best begins an investigation about plant growth?', answers: ['Are plants nice?', 'Which color is best?', 'How does light duration affect height?', 'Do I like plants?'], correct: 2, think: 'A strong research question identifies something measurable.' },
    { prompt: 'What should a researcher do after a surprising result?', answers: ['Hide it', 'Repeat the test and inspect the evidence', 'Change the question', 'Guess'], correct: 1, think: 'Good curiosity follows evidence instead of protecting a prediction.' },
  ],
}
