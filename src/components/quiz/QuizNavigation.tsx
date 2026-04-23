type QuizNavigationProps = {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export default function QuizNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
}: QuizNavigationProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1 || isSubmitting}
        className="w-full sm:w-auto rounded-full border border-zinc-200 px-6 py-3 text-sm font-bold text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="w-full sm:w-auto rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next Page
        </button>
      )}
    </div>
  );
}
