"use client"
import DailyMealPlan from '@/libs/component/DailyMealPlan';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  age: string;
  gender: 'male' | 'female' | 'other';
  dietType: 'vegetarian' | 'non-vegetarian';
  lactoseIntolerant: boolean;
  glutenFree: boolean;
  nuts: boolean;
  shellfish: boolean;
  bmi: string;
  goals: string;
  activityLevel: string;
  sleepDuration: string;
  hydrationStatus: string;
  bloodSugar: string;
  bmr: string;
  budget: 'under-250' | '250-500' | '500-1000' | 'over-1000';
};

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

const MealPlanPersonalization = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      gender: 'male',
      dietType: 'vegetarian',
      budget: 'under-250',
    },
  });


  const [resultPage, setresultPage] = useState(false)
  const [personalizedOption, setpersonalizedOption] = useState(false)
  const [mealPlan, setmealPlan] = useState<MealPlanData | null>(null)
  const [onLoading, setonLoading] = useState(false)


  
  const onSubmit = (data: FormValues) => {
    setonLoading(true)
    const allergies = []
    if (data.lactoseIntolerant) allergies.push("lactoseIntolerant")
    if (data.glutenFree) allergies.push("glutenFree")
    if (data.nuts) allergies.push("nuts")
    if (data.shellfish) allergies.push("shellfish")

    const payload = {
      age: data.age,
      gender: data.gender,
      allergies,
      dietary_preference: data.dietType,
      bmi: data.bmi,
      goal: data.goals,
      activity: data.activityLevel === undefined ? "unknown" : data.activityLevel,
      sleep_duration: data.sleepDuration === undefined ? "unknown" : data.sleepDuration,
      hydration_status: data.hydrationStatus === undefined ? "unknown" : data.hydrationStatus,
      blood_sugar: data.bloodSugar === undefined ? "unknown" : data.bloodSugar,
      budget: data.budget,
      bmr: data.bmr === undefined ? "unknown" : data.bmr,
    }
    
    axios.post("/api/mealplan", payload)
      .then((res) => {
        setmealPlan(res.data.data)
        setresultPage(true)

      })
      .catch((err) => alert(err))
      .finally(() => {
        reset()
        setonLoading(false)
      })
  };

  const handleTryAgain = () => {
    setresultPage(false)
  }
  const handlePersonalized = (status: boolean) => {

    setpersonalizedOption(status)
  }
  return (
    (!resultPage) ?
      (<>
        <div
          className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden"
          style={{
            '--checkbox-tick-svg': 'url(\'data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(14,27,22)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e\')',
            '--radio-dot-svg': 'url(\'data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(20,184,121)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%278%27 cy=%278%27 r=%273%27/%3e%3c/svg%3e\')',
            '--select-button-svg': 'url(\'data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(78,151,123)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e\')',
            fontFamily: 'Lexend, "Noto Sans", sans-serif'
          } as React.CSSProperties}
        >
          <div className="layout-container flex h-full grow flex-col">
            <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
              <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
                {/* Header */}
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <h1 className="text-[#0e1b16] tracking-light text-2xl md:text-[32px] font-bold leading-tight min-w-72">
                    Personalize Your Meal Plan
                  </h1>
                </div>
                <div className="join flex flex-wrap justify-center gap-2">
                  <button
                    className={`btn border-2 rounded-xl p-2  hover:cursor-pointer text-black join-item w-full sm:w-auto ${!personalizedOption ? "bg-blue-500 hover:bg-blue-700 text-white" : "btn-outline"}`}
                    onClick={() => handlePersonalized(false)}
                  >
                    Basic Plan
                  </button>
                  <button
                    className={`btn border-2 rounded-xl p-2 hover:cursor-pointer  text-black join-item w-full sm:w-auto ${personalizedOption ? "bg-blue-500 hover:bg-blue-700 text-white" : "btn-outline"}`}
                    onClick={() => handlePersonalized(true)}
                  >
                    Personalized
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Basic Information Section */}
                  <section>
                    <h3 className="text-[#0e1b16] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                      Basic Information
                    </h3>

                    {/* Age Input */}
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#0e1b16] text-base font-medium leading-normal pb-2">Age</p>
                        <input
                          placeholder="Enter your age"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e1b16] focus:outline-0 focus:ring-0 border border-[#d0e7de] bg-[#f8fcfa] focus:border-[#d0e7de] h-14 placeholder:text-[#4e977b] p-[15px] text-base font-normal leading-normal"
                          {...register('age', {
                            required: 'Age is required', validate: (value) => {
                              const num = Number(value);
                              if (isNaN(num)) return 'Age must be a number';
                              if (num < 0) return 'Age cannot be negative';
                              if (num > 120) return 'Age must be less than or equal to 120';
                              return true;
                            },
                          },)}
                        />
                        {errors.age && (
                          <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                        )}
                      </label>
                    </div>

                    {/* Gender Selection */}
                    <div className="flex flex-col gap-3 p-4">
                      <p className="text-[#0e1b16] text-base font-medium leading-normal pb-2">Gender</p>
                      <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                        <input
                          type="radio"
                          className="h-5 w-5 border-2 border-[#d0e7de] bg-transparent text-transparent checked:border-[#14b879] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                          value="male"
                          {...register('gender')}
                        />
                        <div className="flex grow flex-col">
                          <p className="text-[#0e1b16] text-sm font-medium leading-normal">Male</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                        <input
                          type="radio"
                          className="h-5 w-5 border-2 border-[#d0e7de] bg-transparent text-transparent checked:border-[#14b879] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                          value="female"
                          {...register('gender')}
                        />
                        <div className="flex grow flex-col">
                          <p className="text-[#0e1b16] text-sm font-medium leading-normal">Female</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                        <input
                          type="radio"
                          className="h-5 w-5 border-2 border-[#d0e7de] bg-transparent text-transparent checked:border-[#14b879] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                          value="other"
                          {...register('gender')}
                        />
                        <div className="flex grow flex-col">
                          <p className="text-[#0e1b16] text-sm font-medium leading-normal">Other</p>
                        </div>
                      </label>
                    </div>
                  </section>

                  {/* Dietary Preferences Section */}
                  <section>
                    <h3 className="text-[#0e1b16] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                      Dietary Preferences
                    </h3>

                    {/* Diet Type Selection */}
                    <div className="flex flex-col gap-3 p-4">
                      <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                        <input
                          type="radio"
                          className="h-5 w-5 border-2 border-[#d0e7de] bg-transparent text-transparent checked:border-[#14b879] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                          value="vegetarian"
                          {...register('dietType')}
                        />
                        <div className="flex grow flex-col">
                          <p className="text-[#0e1b16] text-sm font-medium leading-normal">Vegetarian</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                        <input
                          type="radio"
                          className="h-5 w-5 border-2 border-[#d0e7de] bg-transparent text-transparent checked:border-[#14b879] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                          value="non-vegetarian"
                          {...register('dietType')}
                        />
                        <div className="flex grow flex-col">
                          <p className="text-[#0e1b16] text-sm font-medium leading-normal">Non-Vegetarian</p>
                        </div>
                      </label>
                    </div>
                  </section>

                  <section>
                    <h3 className='text-[#0e1b16] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4'>
                      Dietary Restrictions
                    </h3>
                    {/* Dietary Restrictions Checkboxes */}
                    <div className="px-4">
                      <label className="flex items-center mb-3 gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-[#d0e7de] border-2 bg-transparent text-transparent checked:border-[#14b879] checked:bg-[#14b879] checked:bg-[image:--checkbox-tick-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                          {...register('lactoseIntolerant')}
                        />
                        <div className="flex grow flex-col">
                          <p className="text-[#0e1b16] text-sm font-medium leading-normal">Lactose Intolerant</p>
                        </div>
                      </label>
                      <label className="flex items-center mb-3 gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-[#d0e7de] border-2 bg-transparent text-transparent checked:border-[#14b879] checked:bg-[#14b879] checked:bg-[image:--checkbox-tick-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                          {...register('glutenFree')}
                        />
                        <div className="flex grow flex-col">
                          <p className="text-[#0e1b16] text-sm font-medium leading-normal">Gluten-Free</p>
                        </div>
                      </label>
                      <label className="flex items-center mb-3 gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-[#d0e7de] border-2 bg-transparent text-transparent checked:border-[#14b879] checked:bg-[#14b879] checked:bg-[image:--checkbox-tick-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                          {...register('nuts')}
                        />
                        <div className="flex grow flex-col">
                          <p className="text-[#0e1b16] text-sm font-medium leading-normal">Nuts</p>
                        </div>
                      </label>
                      <label className="flex items-center mb-3 gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-[#d0e7de] border-2 bg-transparent text-transparent checked:border-[#14b879] checked:bg-[#14b879] checked:bg-[image:--checkbox-tick-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                          {...register('shellfish')}
                        />
                        <div className="flex grow flex-col">
                          <p className="text-[#0e1b16] text-sm font-medium leading-normal">Shellfish</p>
                        </div>
                      </label>
                    </div>
                  </section>

                  {/* Health Metrics Section */}
                  <section>
                    <h3 className="text-[#0e1b16] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                      Health Metrics
                    </h3>

                    {/* BMI Input */}
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#0e1b16] text-base font-medium leading-normal pb-2">BMI (kg/m²) </p>
                        <input
                          placeholder="Enter your BMI"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e1b16] focus:outline-0 focus:ring-0 border border-[#d0e7de] bg-[#f8fcfa] focus:border-[#d0e7de] h-14 placeholder:text-[#4e977b] p-[15px] text-base font-normal leading-normal"
                          {...register('bmi', {
                            required: 'BMI is required', validate: (value) => {
                              const bmi = parseFloat(value);
                              if (isNaN(bmi)) return 'BMI must be a number';
                              if (bmi < 10) return 'BMI must be at least 10';
                              if (bmi > 60) return 'BMI must not exceed 60';
                              return true;
                            }
                          })}
                        />
                        {errors.bmi && (
                          <p className="text-red-500 text-sm mt-1">{errors.bmi.message}</p>
                        )}
                      </label>
                    </div>

                    {/* Goals Select */}
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#0e1b16] text-base font-medium leading-normal pb-2">Goals</p>
                        <select
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e1b16] focus:outline-0 focus:ring-0 border border-[#d0e7de] bg-[#f8fcfa] focus:border-[#d0e7de] h-14 bg-[image:--select-button-svg] placeholder:text-[#4e977b] p-[15px] text-base font-normal leading-normal"
                          {...register('goals', { required: 'Goals are required' })}
                        >
                          <option value="">Select your goals</option>
                          <option value="weight-loss">Weight Loss</option>
                          <option value="muscle-gain">Muscle Gain</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                        {errors.goals && (
                          <p className="text-red-500 text-sm mt-1">{errors.goals.message}</p>
                        )}
                      </label>
                    </div>
                  </section>

                  {personalizedOption && <>     {/* Personalized Needs Section */}
                    <section>
                      <h3 className="text-[#0e1b16] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                        Personalized Needs
                      </h3>

                      {/* Activity Level Select */}
                      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#0e1b16] text-base font-medium leading-normal pb-2">Activity Level</p>
                          <select
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e1b16] focus:outline-0 focus:ring-0 border border-[#d0e7de] bg-[#f8fcfa] focus:border-[#d0e7de] h-14 bg-[image:--select-button-svg] placeholder:text-[#4e977b] p-[15px] text-base font-normal leading-normal"
                            {...register('activityLevel')}
                          >
                            <option value="">Select your activity level</option>
                            <option value="sedentary">Sedentary</option>
                            <option value="light">Lightly Active</option>
                            <option value="moderate">Moderately Active</option>
                            <option value="active">Very Active</option>
                          </select>
                          {errors.activityLevel && (
                            <p className="text-red-500 text-sm mt-1">{errors.activityLevel.message}</p>
                          )}
                        </label>
                      </div>

                      {/* Sleep Duration Input */}
                      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#0e1b16] text-base font-medium leading-normal pb-2">Sleep Duration</p>
                          <input
                            placeholder="Enter your sleep duration"
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e1b16] focus:outline-0 focus:ring-0 border border-[#d0e7de] bg-[#f8fcfa] focus:border-[#d0e7de] h-14 placeholder:text-[#4e977b] p-[15px] text-base font-normal leading-normal"
                            {...register('sleepDuration', {
                              validate: (value) => {
                                const sleep = parseFloat(value);
                                if (isNaN(sleep)) return 'Sleep duration must be a number';
                                if (sleep < 2) return 'Sleep duration must be at least 2 hours';
                                if (sleep > 16) return 'Sleep duration must not exceed 16 hours';
                                return true;
                              }
                            })}
                          />
                          {errors.sleepDuration && (
                            <p className="text-red-500 text-sm mt-1">{errors.sleepDuration.message}</p>
                          )}
                        </label>
                      </div>

                      {/* Hydration Status Select */}
                      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#0e1b16] text-base font-medium leading-normal pb-2">Hydration Status</p>
                          <select
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e1b16] focus:outline-0 focus:ring-0 border border-[#d0e7de] bg-[#f8fcfa] focus:border-[#d0e7de] h-14 bg-[image:--select-button-svg] placeholder:text-[#4e977b] p-[15px] text-base font-normal leading-normal"
                            {...register('hydrationStatus')}
                          >
                            <option value="">Select your hydration status</option>
                            <option value="low">Low</option>
                            <option value="adequate">Adequate</option>
                            <option value="high">High</option>
                          </select>
                          {errors.hydrationStatus && (
                            <p className="text-red-500 text-sm mt-1">{errors.hydrationStatus.message}</p>
                          )}
                        </label>
                      </div>

                      {/* Blood Sugar Input */}
                      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#0e1b16] text-base font-medium leading-normal pb-2">Blood Sugar (mg/dL)</p>
                          <input
                            placeholder="Enter your blood sugar"
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e1b16] focus:outline-0 focus:ring-0 border border-[#d0e7de] bg-[#f8fcfa] focus:border-[#d0e7de] h-14 placeholder:text-[#4e977b] p-[15px] text-base font-normal leading-normal"
                            {...register('bloodSugar', {
                              validate: (value) => {
                                const sugar = parseFloat(value);
                                if (isNaN(sugar)) return 'Blood sugar must be a number';
                                if (sugar < 40) return 'Too low. Must be at least 40 mg/dL';
                                if (sugar > 500) return 'Too high. Must be below 500 mg/dL';
                                return true;
                              }
                            })}
                          />
                          {errors.bloodSugar && (
                            <p className="text-red-500 text-sm mt-1">{errors.bloodSugar.message}</p>
                          )}
                        </label>
                      </div>

                      {/* BMR Input */}
                      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#0e1b16] text-base font-medium leading-normal pb-2">Basal Metabolic Rate (kcal/day)</p>
                          <input
                            placeholder="Enter your basal metabolic rate"
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e1b16] focus:outline-0 focus:ring-0 border border-[#d0e7de] bg-[#f8fcfa] focus:border-[#d0e7de] h-14 placeholder:text-[#4e977b] p-[15px] text-base font-normal leading-normal"
                            {...register('bmr', {
                              validate: (value) => {
                                const bmr = parseFloat(value);
                                if (isNaN(bmr)) return 'BMR must be a number';
                                if (bmr < 800) return 'Too low. BMR must be at least 800 kcal/day';
                                if (bmr > 4000) return 'Too high. BMR must be below 4000 kcal/day';
                                return true;
                              }
                            })}
                          />
                          {errors.bmr && (
                            <p className="text-red-500 text-sm mt-1">{errors.bmr.message}</p>
                          )}
                        </label>
                      </div>
                    </section>

                    {/* Budget Section */}
                    <section>
                      <h3 className="text-[#0e1b16] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                        Budget (in Rs)
                      </h3>
                      <div className="flex flex-col gap-3 p-4">
                        <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                          <input
                            type="radio"
                            className="h-5 w-5 border-2 border-[#d0e7de] bg-transparent text-transparent checked:border-[#14b879] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                            value="under-250"
                            {...register('budget')}
                          />
                          <div className="flex grow flex-col">
                            <p className="text-[#0e1b16] text-sm font-medium leading-normal">Under 250</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                          <input
                            type="radio"
                            className="h-5 w-5 border-2 border-[#d0e7de] bg-transparent text-transparent checked:border-[#14b879] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                            value="250-500"
                            {...register('budget')}
                          />
                          <div className="flex grow flex-col">
                            <p className="text-[#0e1b16] text-sm font-medium leading-normal">250-500</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                          <input
                            type="radio"
                            className="h-5 w-5 border-2 border-[#d0e7de] bg-transparent text-transparent checked:border-[#14b879] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                            value="500-1000"
                            {...register('budget')}
                          />
                          <div className="flex grow flex-col">
                            <p className="text-[#0e1b16] text-sm font-medium leading-normal">500-1000</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d0e7de] p-[15px]">
                          <input
                            type="radio"
                            className="h-5 w-5 border-2 border-[#d0e7de] bg-transparent text-transparent checked:border-[#14b879] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#14b879]"
                            value="over-1000"
                            {...register('budget')}
                          />
                          <div className="flex grow flex-col">
                            <p className="text-[#0e1b16] text-sm font-medium leading-normal">Over 1000</p>
                          </div>
                        </label>
                      </div>
                    </section> </>
                  }
                  {/* Submit Button */}
                  <div className="flex px-4 py-3 justify-center">
                    <button
                      disabled={onLoading}
                      type="submit"
                      className= {`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4  text-white text-sm font-bold leading-normal tracking-[0.015em] ${onLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700" }  transition-colors`}
                    >
                      <span className="truncate">Create</span>
                    </button>
                  </div>
                  <div className="flex px-4 py-3 justify-center text-blue-500 text-lg">
                    {(onLoading) && "creating your meal plan..."}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>) : (<div className='flex flex-col items-center bg-white'>

        <DailyMealPlan data={mealPlan} />
        <button
          onClick={handleTryAgain}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-blue-500 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors"
        >
          <span className="truncate">Try Again</span>
        </button>
      </div>
      )
  );
};

export default MealPlanPersonalization;