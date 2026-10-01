'use client';

import { useQABot } from '@/components/qa/QABotProvider';
import { getSubcategoriesByCategory, getItemsBySubcategory } from '@/lib/qa-types';

export function QACategorySelector() {
  const {
    currentStep,
    selectedCategoryId,
    selectedSubcategoryId,
    selectCategory,
    selectSubcategory,
    selectQuestion,
    goBack,
    reset,
    qaData,
  } = useQABot();

  // ─── Derived data ───────────────────────────────────────────────────────────

  const selectedCategory = selectedCategoryId
    ? qaData.categories.find((c) => c.id === selectedCategoryId) ?? null
    : null;

  const subcategories =
    selectedCategoryId
      ? getSubcategoriesByCategory(qaData, selectedCategoryId)
      : [];

  const selectedSubcategory =
    selectedSubcategoryId
      ? subcategories.find((s) => s.id === selectedSubcategoryId) ?? null
      : null;

  const qaItems =
    selectedSubcategoryId
      ? getItemsBySubcategory(qaData, selectedSubcategoryId)
      : [];

  // ─── Breadcrumb label ────────────────────────────────────────────────────────

  let breadcrumb: string;
  switch (currentStep) {
    case 'category':
      breadcrumb = 'カテゴリを選んでね';
      break;
    case 'subcategory':
      breadcrumb = selectedCategory ? `${selectedCategory.label} ›` : 'カテゴリを選んでね';
      break;
    case 'question':
      breadcrumb =
        selectedCategory && selectedSubcategory
          ? `${selectedCategory.label} › ${selectedSubcategory.label}`
          : 'カテゴリを選んでね';
      break;
    case 'answer':
      breadcrumb =
        selectedCategory && selectedSubcategory
          ? `${selectedCategory.label} › ${selectedSubcategory.label}`
          : 'カテゴリを選んでね';
      break;
    default:
      breadcrumb = 'カテゴリを選んでね';
  }

  // ─── Shared button class strings ─────────────────────────────────────────────

  const baseButtonClass =
    'w-full min-h-[44px] px-4 py-3 rounded-xl transition-colors duration-150';

  const normalButtonClass =
    `${baseButtonClass} border border-gray-200 bg-white text-sm font-medium text-gray-800 text-left hover:border-green-500 hover:bg-green-50`;

  const categoryButtonClass =
    `${baseButtonClass} border border-gray-200 bg-white text-base font-medium text-gray-800 text-left hover:border-green-500 hover:bg-green-50`;

  const backButtonClass =
    `${baseButtonClass} border-0 bg-transparent text-sm text-gray-500 hover:text-gray-700 text-left`;

  const askAnotherButtonClass =
    `${baseButtonClass} border-0 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 text-left`;

  const resetButtonClass =
    `${baseButtonClass} border-0 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 text-left`;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="px-4 py-3 space-y-2">
      {/* Breadcrumb */}
      <p className="text-xs text-gray-500 mb-2" aria-label={`現在の選択位置: ${breadcrumb}`}>
        {breadcrumb}
      </p>

      {/* Step: category */}
      {currentStep === 'category' && (
        <div className="space-y-2">
          {qaData.categories.map((category) => (
            <button
              key={category.id}
              className={categoryButtonClass}
              onClick={() => selectCategory(category.id)}
              aria-label={`カテゴリ「${category.label}」を選ぶ`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Step: subcategory */}
      {currentStep === 'subcategory' && (
        <div className="space-y-2">
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              className={normalButtonClass}
              onClick={() => selectSubcategory(sub.id)}
              aria-label={`中カテゴリ「${sub.label}」を選ぶ`}
            >
              {sub.label}
            </button>
          ))}
          <button
            className={backButtonClass}
            onClick={goBack}
            aria-label="カテゴリ選択に戻る"
          >
            ← 戻る
          </button>
        </div>
      )}

      {/* Step: question */}
      {currentStep === 'question' && (
        <div className="space-y-2">
          {qaItems.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">
              このカテゴリには現在質問がありません
            </p>
          ) : (
            qaItems.map((item) => (
              <button
                key={item.id}
                className={normalButtonClass}
                onClick={() => selectQuestion(item)}
                aria-label={`質問「${item.question}」を選ぶ`}
              >
                {item.question}
              </button>
            ))
          )}
          <button
            className={backButtonClass}
            onClick={goBack}
            aria-label="中カテゴリ選択に戻る"
          >
            ← 戻る
          </button>
        </div>
      )}

      {/* Step: answer */}
      {currentStep === 'answer' && (
        <div className="space-y-2">
          <button
            className={askAnotherButtonClass}
            onClick={goBack}
            aria-label="別の質問をする"
          >
            別の質問をする
          </button>
          <button
            className={resetButtonClass}
            onClick={reset}
            aria-label="最初のカテゴリ選択に戻る"
          >
            最初に戻る
          </button>
        </div>
      )}
    </div>
  );
}
