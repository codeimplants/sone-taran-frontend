export const formatLoanDuration = ({
  years,
  months,
  days,
}: {
  years: number;
  months: number;
  days: number;
}): JSX.Element => {
  const parts = [
    years > 0 && `${years} Years`,
    months > 0 && `${months} Months`,
    days > 0 && `${days} Days`,
  ].filter(Boolean);

  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  );
};

export const calculateTodaysValue = (
  netWeight: number,
  purity: number,
  metalRate: number
): number => {
  // console.log(netWeight, purity, metalRate);
  const pureGoldWeight = (netWeight * purity) / 100;
  const metalValue = pureGoldWeight * metalRate;
  return metalValue;

};
