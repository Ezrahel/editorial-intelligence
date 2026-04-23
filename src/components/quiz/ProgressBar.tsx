type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  answeredQuestions: number;
  totalQuestions: number;
};

export default function ProgressBar({
  currentStep,
  totalSteps,
  answeredQuestions,
  totalQuestions,
}: ProgressBarProps) {
  const completionPercentage =
    totalQuestions === 0 ? 0 : Math.round((answeredQuestions / totalQuestions) * 100);

  return (
    <section className="bg-white rounded-[2rem] p-6 md:p-8 editorial-shadow border border-zinc-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.24em] text-tertiary mb-2">
            Tech Quiz Progress
          </p>
          <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Page {currentStep} of {totalSteps}
          </h2>
        </div>
        <div className="text-left md:text-right">
          <p className="font-label text-[10px] uppercase tracking-[0.24em] text-zinc-400 mb-2">
            Completion
          </p>
          <p className="font-headline text-3xl font-bold text-primary">{completionPercentage}%</p>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <p className="mt-4 break-words text-sm text-secondary">
        {answeredQuestions} of {totalQuestions} questions answered so far.
      </p>
    </section>
  );
}
