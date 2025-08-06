import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    temperature: 1,
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

export async function POST(req: NextRequest) {
   try {
     const { age, gender, allergies, dietary_preference, bmi, goal, activity, sleep_duration, hydration_status, blood_sugar, budget, bmr } = await req.json()
 
const prompt = `You are a smart nutrition assistant. Based on the following user profile, generate a personalized daily meal plan. Return the output in valid JSON format with the following structure:

{
  "daily_calorie_target": string,
  "meals": {
    "breakfast": {
      "meal": string,
      "ingredients": string[],
      "preparation": string,
      "calories": string,
      "macros": string
    },
    "snack1": {
      "meal": string,
      "ingredients": string[],
      "preparation": string,
      "calories": string,
      "macros": string
    },
    "lunch": {
      "meal": string,
      "ingredients": string[],
      "preparation": string,
      "calories": string,
      "macros": string
    },
    "snack2": {
      "meal": string,
      "ingredients": string[],
      "preparation": string,
      "calories": string,
      "macros": string
    },
    "dinner": {
      "meal": string,
      "ingredients": string[],
      "preparation": string,
      "calories": string,
      "macros": string
    }
  },
  "nutritional_guidance": string[]
}

User Profile:
- Age: ${age} years
- Gender: ${gender}
- Allergies/Intolerances: ${allergies}
- Dietary Preference: ${dietary_preference}
- BMI: ${bmi}
- Goal: ${goal}
- Activity Level (optional): ${activity}
- Sleep Duration (optional): ${sleep_duration} hours
- Hydration Status (optional): ${hydration_status}
- Blood Sugar (optional): ${blood_sugar} mg/dL
- Budget (optional): ${budget}
- Basal Metabolic Rate (BMR) (optional): ${bmr} kcal/day

Instructions:
- If BMR is available, use it to guide calorie intake. If not, estimate from BMI, age, and activity.
- Strictly avoid allergens and respect dietary preferences.
- Support the user's health goal through proper macros (e.g., high protein for weight gain).
- Consider budget and hydration/sleep if provided.
- Keep meals practical and easy to prepare.
- If any data is missing, use reasonable assumptions based on age, gender, and goal.
- Format the response strictly in valid JSON. Do not include markdown or commentary.
- Budget is provided in Indian Rupees per day. Ensure the entire meal plan stays within this daily budget.
- Prefer Indian diet items to suit local tastes and availability. Include Indian dishes as primary options; international foods can be included only if practical.
- For non-vegetarian diets, strictly avoid beef and pork. Use chicken, fish, eggs, or other regionally acceptable meats instead.
`;

     const res = await model.invoke(prompt);
     const content:any  = res.content
     const cleaned = content.replace(/```json|```/g, '').trim();

    const resObject = JSON.parse(cleaned);
    
    return NextResponse.json({message: "successfully created the meal plan" ,data: resObject},{status: 200});
   } catch (error) {
        console.log(error);
        NextResponse.json({error: "Internal server error"},{status: 500})
        
   }
}
