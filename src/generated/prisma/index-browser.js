
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 173f8d54f8d52e692c7e27e72a88314ec7aeff60
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "173f8d54f8d52e692c7e27e72a88314ec7aeff60"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  role: 'role',
  created_at: 'created_at',
  full_name: 'full_name',
  major: 'major',
  password_hash: 'password_hash',
  phone: 'phone',
  university: 'university',
  profile_picture_url: 'profile_picture_url',
  updated_at: 'updated_at'
};

exports.Prisma.TokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  user_id: 'user_id',
  expires_at: 'expires_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  type: 'type',
  amount: 'amount',
  description: 'description',
  category: 'category',
  transaction_date: 'transaction_date',
  transaction_time: 'transaction_time',
  payment_method: 'payment_method',
  notes: 'notes',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RecurringTransactionScalarFieldEnum = {
  id: 'id',
  transaction_id: 'transaction_id',
  frequency: 'frequency',
  end_type: 'end_type',
  end_date: 'end_date',
  occurrences: 'occurrences',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.FinancialGoalScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  name: 'name',
  target_amount: 'target_amount',
  current_amount: 'current_amount',
  deadline: 'deadline',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  type: 'type',
  name_en: 'name_en',
  name_id: 'name_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.BudgetScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  category: 'category',
  amount: 'amount',
  spent: 'spent',
  month_year: 'month_year',
  created_at: 'created_at',
  updated_at: 'updated_at',
  notes: 'notes'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  amount: 'amount',
  status: 'status',
  orderId: 'orderId',
  snapToken: 'snapToken',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChallengeScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  total_days: 'total_days',
  target_amount: 'target_amount',
  color: 'color',
  difficulty: 'difficulty',
  type: 'type',
  targetText: 'targetText',
  features: 'features',
  steps: 'steps',
  tips: 'tips',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UserChallengeScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  challenge_id: 'challenge_id',
  status: 'status',
  start_date: 'start_date',
  end_date: 'end_date',
  goal: 'goal',
  current_day: 'current_day',
  current_amount: 'current_amount',
  percent_complete: 'percent_complete',
  color: 'color',
  created_at: 'created_at',
  updated_at: 'updated_at',
  notifications: 'notifications'
};

exports.Prisma.ChallengeActivityScalarFieldEnum = {
  id: 'id',
  challenge_id: 'challenge_id',
  action: 'action',
  date: 'date',
  amount: 'amount',
  completed: 'completed',
  difficulty: 'difficulty',
  notes: 'notes',
  shared: 'shared',
  created_at: 'created_at',
  updated_at: 'updated_at',
  userChallengeId: 'userChallengeId'
};

exports.Prisma.ChallengeCatalogScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  features: 'features',
  target_text: 'target_text',
  color: 'color',
  duration: 'duration',
  difficulty: 'difficulty',
  category: 'category',
  type: 'type',
  steps: 'steps',
  tips: 'tips',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ChallengeBadgeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  icon: 'icon',
  color: 'color',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UserBadgeScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  badge_id: 'badge_id',
  earned_at: 'earned_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

exports.TransactionType = exports.$Enums.TransactionType = {
  income: 'income',
  expense: 'expense'
};

exports.RecurringFrequency = exports.$Enums.RecurringFrequency = {
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly'
};

exports.EndType = exports.$Enums.EndType = {
  never: 'never',
  on_date: 'on_date',
  after_occurrences: 'after_occurrences'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED'
};

exports.ChallengeType = exports.$Enums.ChallengeType = {
  saving: 'saving',
  spending: 'spending',
  habit: 'habit'
};

exports.ChallengeStatus = exports.$Enums.ChallengeStatus = {
  active: 'active',
  completed: 'completed',
  failed: 'failed'
};

exports.Prisma.ModelName = {
  User: 'User',
  Token: 'Token',
  Transaction: 'Transaction',
  RecurringTransaction: 'RecurringTransaction',
  FinancialGoal: 'FinancialGoal',
  Category: 'Category',
  Budget: 'Budget',
  Payment: 'Payment',
  Challenge: 'Challenge',
  UserChallenge: 'UserChallenge',
  ChallengeActivity: 'ChallengeActivity',
  ChallengeCatalog: 'ChallengeCatalog',
  ChallengeBadge: 'ChallengeBadge',
  UserBadge: 'UserBadge'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
