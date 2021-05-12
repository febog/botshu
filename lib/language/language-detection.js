// Using Azure Text Analytics language detection service, returns the top
// detected language for the given string. The returned object follows the
// |DetectedLanguage| interface documented in
// https://docs.microsoft.com/en-us/javascript/api/@azure/ai-text-analytics/detectedlanguage
const {
    TextAnalyticsClient,
    AzureKeyCredential,
} = require("@azure/ai-text-analytics");
const key = process.env.TEXT_ANALYTICS_KEY;
const endpoint =
    "https://botshu-language-detection.cognitiveservices.azure.com/";
const textAnalyticsClient = new TextAnalyticsClient(
    endpoint,
    new AzureKeyCredential(key)
);

module.exports = {
    /**
     * Get the |DetectedLanguage| object for the given string.
     * @param {string} message Text to analyze.
     * @returns DetectedLanguage object.
     */
    async detectLanguage(message) {
        // Give message and US country hint to language detection service.
        const languageResult = await textAnalyticsClient.detectLanguage(
            [message],
            "us"
        );

        let result = {};
        languageResult.forEach((document) => {
            result = document.primaryLanguage;
        });
        return result;
    },
};
