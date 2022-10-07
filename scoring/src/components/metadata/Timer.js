const Timer = ({ title, remainingTime }) => {
  const remainingTimeInSeconds = Math.round(remainingTime / 1000);
  const remainingMinutes = Math.floor(remainingTimeInSeconds / 60);
  const remainingSeconds = remainingTimeInSeconds - remainingMinutes * 60;
  return (
    <div>
      <h3>{title}</h3>
      <div>
        {remainingMinutes}min {remainingSeconds}s
      </div>
    </div>
  );
};

export default Timer;
