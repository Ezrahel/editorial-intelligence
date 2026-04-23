type QuestionCardProps = {
  questionNumber: number;
  questionText: string;
  category: string;
  options: string[];
  selectedOptionIndex?: number;
  showUnansweredWarning?: boolean;
  onSelect: (optionIndex: number) => void;
};

export default function QuestionCard({
  questionNumber,
  questionText,
  category,
  options,
  selectedOptionIndex,
  showUnansweredWarning = false,
  onSelect,
}: QuestionCardProps) {
  return (
    <article
      className={`bg-white rounded-[2rem] p-6 md:p-8 editorial-shadow border ${
        showUnansweredWarning ? 'border-red-300 bg-red-50/30' : 'border-zinc-100'
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="font-label text-[10px] uppercase tracking-[0.24em] text-zinc-400 mb-3">
            Question {questionNumber.toString().padStart(2, '0')}
          </p>
          <h3 className="break-words font-headline text-xl md:text-2xl font-bold tracking-tight text-on-surface leading-tight">
            {questionText}
          </h3>
        </div>
        <span className="self-start max-w-full break-words rounded-full bg-tertiary-fixed px-4 py-2 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-tertiary">
          {category}
        </span>
      </div>

      {showUnansweredWarning ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Question {questionNumber} is not answered yet.
        </p>
      ) : null}

      <div className="mt-6 grid gap-3">
        {options.map((option, optionIndex) => {
          const isSelected = selectedOptionIndex === optionIndex;

          return (
            <button
              key={`${questionNumber}-${optionIndex}`}
              type="button"
              onClick={() => onSelect(optionIndex)}
              className={`flex w-full items-start gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-zinc-100 bg-zinc-50 text-zinc-700 hover:border-primary/30 hover:bg-white'
              }`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-label text-xs font-bold ${
                  isSelected ? 'bg-primary text-white' : 'bg-white text-zinc-500'
                }`}
              >
                {String.fromCharCode(65 + optionIndex)}
              </span>
              <span className="min-w-0 break-words text-sm md:text-base leading-relaxed">{option}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
