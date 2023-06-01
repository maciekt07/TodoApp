/**
 * Returns a random greeting message to inspire productivity.
 * @returns {string} A random greeting message.
 */
export const getRandomGreeting = (): string => {
  const greetingsText: string[] = [
    "Let's make today count!",
    "Start your day with a plan!",
    "Get things done and conquer the day!",
    "Stay focused, stay productive.",
    "Embrace the power of productivity!",
    "Set your goals, crush them, repeat.",
    "Today is a new opportunity to be productive!",
    "Make every moment count.",
    "Stay organized, stay ahead.",
    "Take charge of your day!",
    "Unlock your productivity potential.",
    "Turn your to-do list into a to-done list!",
    "One task at a time, you've got this!",
    "Productivity is the key to success.",
    "Let's turn plans into accomplishments!",
    "Start small, achieve big.",
    "Be efficient, be productive.",
    "Harness the power of productivity!",
    "Get ready to make things happen!",
    "It's time to check off those tasks!",
  ];
  const randomIndex = Math.floor(Math.random() * greetingsText.length);
  return greetingsText[randomIndex];
};
