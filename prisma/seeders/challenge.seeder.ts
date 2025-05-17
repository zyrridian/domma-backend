import { features } from "process";
import {
  PrismaClient,
  ChallengeType,
  ChallengeStatus,
} from "../../src/generated/prisma";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

/**
 * Truncate challenge data before seeding
 */
async function truncateChallenges() {
  try {
    // Delete all challenge activities first (due to foreign key constraints)
    await prisma.challengeActivity.deleteMany({});
    console.log("🧹 Deleted all challenge activities");

    // Then delete all challenges
    await prisma.challenge.deleteMany({});
    console.log("🧹 Deleted all challenges");
  } catch (error) {
    console.error("❌ Error truncating challenge data:", error);
  }
}

/**
 * Seed challenge data for development and testing purposes
 */
async function seedChallenges() {
  console.log("🌱 Seeding challenge data...");

  // Clear existing data first
  await truncateChallenges();

  // First, get a user to associate with the challenges
  // You can modify this to use a specific user or create a new one if needed
  // const user = await prisma.user.findFirst();

  // if (!user) {
  //   console.error("❌ No user found in the database. Please seed users first.");
  //   return;
  // }

  // Sample challenge data
  const challenges = [
    {
      id: randomUUID(),
      title: "30-Day No Eating Out",
      description: "Cook all your meals at home for 30 days",
      total_days: 30,
      target_amount: 150000,
      color: "#10b981",
      difficulty: 3,
      type: ChallengeType.spending,
      targetText: "Avg. Savings: Rp150.000",
      features: [
        "Track daily spending on food",
        "Cook all meals at home",
        "Save receipts for grocery shopping",
      ],
      steps: [
        "Plan your weekly meals ahead of time",
        "Do grocery shopping at the start of each week",
        "Cook at least one meal a day at home",
        "Track your food expenses and compare them to your usual spending",
        "Review your progress and savings every week",
      ],
      tips: [
        "Start with simple and budget-friendly recipes",
        "Stock up on long-lasting essentials (rice, eggs, frozen veggies)",
        "Meal prep on weekends to save time during the week",
        "Keep healthy snacks at home to avoid eating out",
        "Make it fun by trying out new dishes or cooking with someone",
      ],
    },
    {
      id: randomUUID(),
      title: "52-Week Savings",
      description: "Save an increasing amount each week for a year",
      total_days: 52,
      target_amount: 1378000, // Sum of 1 to 52 weeks in thousands
      color: "#3b82f6",
      difficulty: 4,
      type: ChallengeType.saving,
      targetText: "Total: ~Rp1.378.000",
      features: [
        "Week 1: Save Rp5.000",
        "Week 2: Save Rp10.000",
        "Increase by Rp5.000 each week",
      ],
      steps: [
        "Start with saving Rp1.000 in week 1",
        "Increase your savings by Rp1.000 each week",
        "By week 52, you'll be saving Rp52.000 for that week",
        "Track your progress weekly",
        "Celebrate milestones (13 weeks, 26 weeks, etc.)",
      ],
      tips: [
        "Set up automatic transfers if possible",
        "Keep a visual tracker of your progress",
        "If a week is difficult, don't give up - just continue the next week",
        "Consider saving in reverse (start with Rp52.000 and decrease) if that works better for you",
        "Use a dedicated savings account for this challenge",
      ],
    },
    {
      id: randomUUID(),
      title: "No Spend Weekend",
      description: "Commit to spending Rp0 for an entire weekend",
      total_days: 2,
      target_amount: 50000,
      color: "#f59e0b",
      difficulty: 2,
      type: ChallengeType.spending,
      targetText: "Est. Savings: Rp50.000+",
      features: [
        "No discretionary spending for 48 hours",
        "Break the impulse spending habit",
        "Do this challenge once a month",
      ],
      steps: [
        "Plan your weekend activities in advance (all free)",
        "Prepare meals for the weekend ahead of time",
        "Remove payment methods from your phone/wallet",
        "Track what you would have spent",
        "Reflect on what you learned at the end",
      ],
      tips: [
        "Find free entertainment options in your area",
        "Invite friends for potluck instead of going out",
        "Use what you already have at home",
        "Try this challenge once a month",
        "Share your experience with friends to stay accountable",
      ],
    },
    {
      id: randomUUID(),
      title: "30-Day Rp5.000 Challenge",
      description: "Save Rp5.000 every day for a month",
      total_days: 30,
      target_amount: 150000,
      color: "#8b5cf6",
      difficulty: 1,
      type: ChallengeType.saving,
      targetText: "Target: Rp150.000",
      features: [
        "Put away Rp5.000 each day",
        "Save Rp150.000 in just one month",
        "Perfect for beginners",
      ],
      steps: [
        "Set aside Rp5.000 each day",
        "Use a physical jar or dedicated account",
        "Don't skip days - consistency is key",
        "Track your progress visually",
        "At the end, decide what to do with your savings",
      ],
      tips: [
        "Set a daily reminder on your phone",
        "Try to find one small expense to cut each day",
        "If you forget a day, add Rp10.000 the next day",
        "Take a photo of your growing savings",
        "Perfect for beginners to build the saving habit",
      ],
    },
    {
      id: randomUUID(),
      title: "Subscription Audit",
      description: "Review and cancel unnecessary subscriptions",
      total_days: 7,
      target_amount: 120000,
      color: "#f43f5e",
      difficulty: 2,
      type: ChallengeType.spending,
      targetText: "Est. Savings: Rp100.000+",
      features: [
        "Identify recurring subscription costs",
        "Cut down on unused or duplicate services",
        "Instantly see monthly and yearly savings",
      ],
      steps: [
        "List all your current subscriptions and their costs",
        "Evaluate which ones you actually use regularly",
        "Research alternatives for essential services",
        "Cancel at least 2 unnecessary subscriptions",
        "Calculate your monthly and yearly savings",
      ],
      tips: [
        "Check your bank and credit card statements for the last 3 months",
        "Use subscription tracking apps to find hidden charges",
        "Consider sharing subscriptions with family or friends",
        "Set calendar reminders for free trial expirations",
        "Renegotiate essential subscriptions for better rates",
      ],
    },
    {
      id: randomUUID(),
      title: "1% More Savings",
      description: "Increase your monthly savings rate by 1%",
      total_days: 90,
      target_amount: 300000,
      color: "#10b981",
      difficulty: 3,
      type: ChallengeType.saving,
      targetText: "3-month challenge",
      features: [
        "Start with just 1% of your income",
        "Add another 1% each month",
        "Build sustainable saving habits",
      ],
      steps: [
        "Calculate 1% of your monthly income",
        "Set up automatic transfer of this amount",
        "Next month, increase to 2%",
        "Third month, increase to 3%",
        "Evaluate if you can maintain or increase further",
      ],
      tips: [
        "Start with just 1% - it's small enough not to feel painful",
        "Look for one expense targetText to reduce each month",
        "Use a separate savings account for this challenge",
        "Track how the small increases add up over time",
        "This builds sustainable long-term saving habits",
      ],
    },
  ];

  // Create the challenges in the database
  for (const challenge of challenges) {
    try {
      await prisma.challenge.upsert({
        where: { id: challenge.id },
        update: challenge,
        create: challenge,
      });
      console.log(`✅ Created challenge: ${challenge.title}`);
    } catch (error) {
      console.error(`❌ Error creating challenge "${challenge.title}":`, error);
    }
  }

  console.log("🌱 Challenge seeding completed!");
}

export { seedChallenges, truncateChallenges };
