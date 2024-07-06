export const AUTH_API_ENDPOINT = process.env.REACT_APP_AUTH_API_ENDPOINT || "https://v0dqq00bsf.execute-api.us-east-1.amazonaws.com/production"
export const SNS_ENDPOINT = process.env.REACT_APP_SNS_ENDPOINT || "https://zkaxfj6jp3.execute-api.us-east-1.amazonaws.com/prod"

export const REGISTER_USER_API_ENDPOINT = AUTH_API_ENDPOINT + "/register"
export const LOGIN_USER_API_ENDPOINT = AUTH_API_ENDPOINT + "/login"
export const VALIDATE_SECURITY_ANSWER_API_ENDPOINT = AUTH_API_ENDPOINT + "/validate-security-answer"
export const CAESAR_CIPHER_CHALLENGE_API_ENDPOINT = AUTH_API_ENDPOINT + "/caesar-cipher"
export const SNS_SUBSCRIBE_INDIVIDUAL_LOGIN_TOPIC = `${SNS_ENDPOINT}/createsubsctopic`
export const SNS_PUBLISH_LOGIN_EMAIL = `${SNS_ENDPOINT}/publish-login`

export const PROPERTIES_RESULT_API_ENDPOINT = process.env.REACT_APP_PROPERTY_API_ENDPOINT
export const FETCH_PROPERTY_API_ENDPOINT = process.env.REACT_APP_FETCH_PROPERTY_API_ENDPOINT
export const FETCH_PROPERTY_REVIEWS_API_ENDPOINT = process.env.REACT_APP_PROPERTY_REVIEWS_API_ENDPOINT
export const BOOK_PROPERTY_API_ENDPOINT = process.env.REACT_APP_BOOK_PROPERTY_API_ENDPOINT

export const securityQuestions = [
    "What was the name of your first pet",
    "What was the name of your elementary school",
    "What was the make and model of your first car",
    "What is your favorite book",
    "What city were you born in",
    "What was the name of your first employer",
    "What was the name of your best friend in high school",
    "What was the first concert you attended",
    "What is the name of your favorite childhood teacher"
]