/**
 * Returns a random greeting message to inspire productivity.
 * @returns {string} A random greeting message.
 */
export const getRandomGreeting = (): string => {
  const hoursLeft = 24 - new Date().getHours();

  const greetingsText: string[] = [
    "Let's make today count!",
    "Get things done and conquer the day!",
    "Embrace the power of productivity!",
    "Set your goals, crush them, repeat.",
    "Today is a new opportunity to be productive!",
    "Make every moment count.",
    "Stay organized, stay ahead.",
    "Take charge of your day!",
    "One task at a time, you've got this!",
    "Productivity is the key to success.",
    "Let's turn plans into accomplishments!",
    "Start small, achieve big.",
    "Be efficient, be productive.",
    "Harness the power of productivity!",
    "Get ready to make things happen!",
    "It's time to check off those tasks!",

    " Start your day with a plan!",
    "Stay focused, stay productive.",
    "Unlock your productivity potential.",
    "Turn your to-do list into a to-done list!",

    `Have a wonderful  ${new Date().toLocaleDateString("en", {
      weekday: "long",
    })}!`,
    `Happy ${new Date().toLocaleDateString("en", {
      month: "long",
    })}! A great month for productivity!`,
    hoursLeft > 4
      ? `${hoursLeft} hours left in the day. Use them wisely!`
      : `Only ${hoursLeft} hours left in the day`,

    // <TextWithEmoji emojiStyle={emojiStyle} unified="1f5d3-fe0f">
    //   Start your day with a plan!
    // </TextWithEmoji>,
    // <TextWithEmoji emojiStyle={emojiStyle} unified="1f3af">
    //   Stay focused, stay productive.
    // </TextWithEmoji>,
    // <TextWithEmoji emojiStyle={emojiStyle} unified="1f513">
    //   Unlock your productivity potential.
    // </TextWithEmoji>,
    // <TextWithEmoji emojiStyle={emojiStyle} unified="2705">
    //   Turn your to-do list into a to-done list!
    // </TextWithEmoji>,
  ];

  const randomIndex = Math.floor(Math.random() * greetingsText.length);
  return greetingsText[randomIndex];
};

// interface EmojiTextProps {
//   children: ReactNode;
//   emojiStyle: EmojiStyle;
//   unified: string;
// }

// const TextWithEmoji = ({ children, emojiStyle, unified }: EmojiTextProps) => {
//   return (
//     <span style={{ display: "flex", alignItems: "center" }}>
//       {children}&nbsp;
//       <Emoji emojiStyle={emojiStyle} unified={unified} size={20} />
//     </span>
//   );
// };
