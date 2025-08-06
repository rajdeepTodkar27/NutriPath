import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

type Meal = {
    meal: string;
    ingredients: string[];
    preparation: string;
    calories: string;
    macros: string;
};

type MealPlanData = {
    daily_calorie_target: string;
    meals: {
        breakfast: Meal;
        snack1: Meal;
        lunch: Meal;
        snack2: Meal;
        dinner: Meal;
    };
    nutritional_guidance: string[];
};

type DailyMealPlanProps = {
    data: MealPlanData | null;
};

const DailyMealPlan: React.FC<DailyMealPlanProps> = ({ data }) => {
    const mealOrder = [
        { key: 'breakfast', title: '☕ Breakfast', subtitle: 'Morning Fuel' },
        { key: 'snack1', title: '🥗 Snack 1', subtitle: 'Mid-Morning Boost' },
        { key: 'lunch', title: '🍱 Lunch', subtitle: 'Midday Meal' },
        { key: 'snack2', title: '🥗 Snack 2', subtitle: 'Afternoon Pick-Me-Up' },
        { key: 'dinner', title: '🍽️ Dinner', subtitle: 'Evening Meal' }
    ];
    const pdfRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        console.log("working");

        if (pdfRef.current) {
            const element = pdfRef.current;
            const html2pdf = (await import('html2pdf.js')).default;
            html2pdf()
                .set({
                    margin: 0.7,
                    filename: 'Daily_Meal_Plan.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                })
                .from(element)
                .save();
        }
    };

    return (
        (data !== null && data.meals) &&
        (<div
            className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
            style={{
                '--checkbox-tick-svg':
                    "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(17,23,20)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')",
                fontFamily: 'Lexend, "Noto Sans", sans-serif'
            } as React.CSSProperties}
        >
            <div ref={pdfRef} className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
                        <div className="flex flex-wrap justify-between gap-3 p-4">
                            <div className="flex min-w-72 flex-col gap-3">
                                <h1 className="text-[#111714] tracking-light text-2xl md:text-[32px] font-bold leading-tight">
                                    Daily Meal Plan
                                </h1>

                                <p className="text-[#648772] text-sm font-normal leading-normal">
                                    Achieve your health goals with a personalized meal plan.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 p-4">
                            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#f0f4f2]">
                                <p className="text-[#111714] text-base font-medium leading-normal">Daily Calorie Target</p>
                                <p className="text-[#111714] tracking-light text-2xl font-bold leading-tight">{data.daily_calorie_target}</p>
                            </div>
                        </div>

                        {mealOrder.map((item) => {
                            const meal = data.meals[item.key as keyof typeof data.meals];
                            return (
                                <section key={item.key} className="mb-8">
                                    <h2 className="text-[#111714] text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                                        {item.title}
                                    </h2>
                                    <div className="p-4">
                                        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 rounded-lg">
                                            <div className="flex flex-[2_2_0px] flex-col gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[#648772] text-sm font-normal leading-normal">{item.subtitle}</p>
                                                    <h3 className="text-[#111714] text-base font-bold leading-tight">{meal.meal}</h3>
                                                    <p className="text-[#648772] text-sm font-normal leading-normal">A delicious and nutritious option.</p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce5df] py-5">
                                            <p className="text-[#648772] text-sm font-normal leading-normal">Ingredients</p>
                                            <p className="text-[#111714] text-sm font-normal leading-normal">{meal.ingredients.join(', ')}</p>
                                        </div>
                                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce5df] py-5">
                                            <p className="text-[#648772] text-sm font-normal leading-normal">Preparation</p>
                                            <p className="text-[#111714] text-sm font-normal leading-normal">{meal.preparation}</p>
                                        </div>
                                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce5df] py-5">
                                            <p className="text-[#648772] text-sm font-normal leading-normal">Calories</p>
                                            <p className="text-[#111714] text-sm font-normal leading-normal">{meal.calories}</p>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between gap-x-6 py-2">
                                            <p className="text-[#648772] text-sm font-normal leading-normal">Macros</p>
                                            <p className="text-[#111714] text-sm font-normal leading-normal text-right">{meal.macros}</p>
                                        </div>
                                    </div>
                                </section>
                            );
                        })}

                        <section>
                            <h2 className="text-[#111714] text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                                Nutritional Guidance
                            </h2>
                            <div className="px-4">
                                {data.nutritional_guidance.map((tip, index) => (
                                    <label key={index} className="flex gap-x-3 py-3 flex-row items-start">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 rounded border-[#dce5df] border-2 bg-transparent text-[#38e07b] checked:bg-[#38e07b] checked:border-[#38e07b] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#dce5df] focus:outline-none mt-1"
                                        />
                                        <p className="text-[#111714] text-base font-normal leading-normal flex-1">{tip}</p>
                                    </label>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
            <div className='flex justify-center mb-6'>
                <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded-xl shadow-lg"
                >
                    Download PDF
                </button>
            </div>
        </div>)
    );
};

export default DailyMealPlan;
