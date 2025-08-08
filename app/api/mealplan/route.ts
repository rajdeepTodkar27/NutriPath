import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash',
  temperature: 1,
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const { age, gender, allergies, dietary_preference, bmi, goal, activity, sleep_duration, hydration_status, blood_sugar, budget, bmr } = await req.json()

    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        daily_calorie_target: z.string(),
        meals: z.object({
          breakfast: zMeal(),
          snack1: zMeal(),
          lunch: zMeal(),
          snack2: zMeal(),
          dinner: zMeal()
        }),
        nutritional_guidance: z.array(z.string())
      })
    );

    function zMeal() {
      return z.object({
        meal: z.string(),
        ingredients: z.array(z.string()),
        preparation: z.string(),
        calories: z.string(),
        macros: z.string()
      });
    }

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a smart nutrition assistant."],
      ["user", `
Based on the following user profile, generate a personalized daily meal plan.

User Profile:
- Age: {age} years
- Gender: {gender}
- Allergies/Intolerances: {allergies}
- Dietary Preference: {dietary_preference}
- BMI: {bmi}
- Goal: {goal}
- Activity Level: {activity}
- Sleep Duration: {sleep_duration} hours
- Hydration Status: {hydration_status}
- Blood Sugar: {blood_sugar} mg/dL
- Budget: {budget}
- Basal Metabolic Rate (BMR): {bmr} kcal/day

Instructions:
- If BMR is available, use it to guide calorie intake; otherwise estimate.
- Avoid allergens & follow dietary preferences.
- Support user's health goal with proper macros.
- Stay within budget (INR per day) using mostly Indian dishes.
- Avoid beef & pork; non-veg can use chicken, fish, eggs.
- Output must be valid JSON matching the schema.

{format_instructions}
`]
    ]);

    const chain = RunnableSequence.from([
      prompt,
      model,
      parser
    ]);

    const result = await chain.invoke({ age, gender, allergies, dietary_preference, bmi, goal, activity, sleep_duration, hydration_status, blood_sugar, budget, bmr, format_instructions: parser.getFormatInstructions() })

    
    return NextResponse.json({ message: "successfully created the meal plan", data: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    NextResponse.json({ error: "Internal server error" }, { status: 500 })

  }
}
