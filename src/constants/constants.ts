/**
 * Maximum length allowed for task names.
 */
export const TASK_NAME_MAX_LENGTH = 40;

/**
 * Maximum length allowed for task descriptions.
 */
export const DESCRIPTION_MAX_LENGTH = 350;

/**
 * Shorter length for displaying descriptions with a "Show More" button.
 */
export const DESCRIPTION_SHORT_LENGTH = 100;

/**
 * Maximum length allowed for user names.
 */
export const USER_NAME_MAX_LENGTH = 14;

/**
 * Maximum length allowed for profile picture URLs.
 */
export const PROFILE_PICTURE_MAX_LENGTH = 255;

/**
 * Maximum length allowed for category names.
 */
export const CATEGORY_NAME_MAX_LENGTH = 20;

/**
 * Maximum number of categories can be assigned to one task
 */
export const MAX_CATEGORIES_IN_TASK = 3;

/**
 * Maximum number of colors in color picker list a user can have.
 */
export const MAX_COLORS_IN_LIST = 32;

/**
 * Maximum size of uploaded profile picture.
 */
export const PFP_MAX_SIZE = 16 * 1024 * 1024; //MB;
/**
 * Maximum number of tasks a user can have.
 */
// export const MAX_TASKS: number = 200;

/**
 * Regular expression to match URLs in a string
 */
export const URL_REGEX = /((?:https?):\/\/[^\s/$.?#].[^\s]*)/gi;
