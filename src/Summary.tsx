import Button from "./Button";
import NumberFormat from "@number-flow/react";

export default function Summary({
  correct,
  incorrect,
  onTryWrongOnly,
}: {
  correct: number;
  incorrect: number;
  onTryWrongOnly: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Summary</h1>
      <p className="text-lg">
        Correct: <NumberFormat value={correct} />
      </p>
      <p className="text-lg">
        Incorrect: <NumberFormat value={incorrect} />
      </p>
      <Button onClick={onTryWrongOnly} label="Try Wrong Only" />
    </div>
  );
}
