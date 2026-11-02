# Languages!! 

Currently, we supports these languages:

 - **Spanish (Mainly)**
 - English

## Adding or Editing Languages in CRM Game

### Introduction

In CRM, language files are used to translate game texts. These files follow a specific naming convention and are located in `src/main/resources/bundle`.

### Adding a New Language

To add a new language to CRM, follow these steps:

1. **Create a New Properties File:**
   - Duplicate an existing language file, e.g., `Text_es_ES.properties`, and rename it for the new language, following the format `Text_languageCode_COUNTRYCODE.properties`. For example, `Text_fr_FR.properties` for French in France.

2. **Translate Texts:**
   - Open the new file (`Text_languageCode_COUNTRYCODE.properties`) and replace the English text on the right-hand side of each key with the corresponding translation in the new language.

3. **Save the File:**
   - Save the file in the `src/main/resources/bundle` directory.

### Editing an Existing Language

To edit an existing language in CRM, follow these steps:

1. **Locate the Language File:**
   - Identify the language file you wish to edit in the `src/main/resources/bundle` directory, e.g., `Text_es_ES.properties` for Spanish in Spain.

2. **Modify Texts:**
   - Open the file and edit the translations on the right-hand side of each key according to the changes needed.

3. **Save the File:**
   - Save your changes to the file.

### Notes:

- **Formatting:** Ensure that each line follows the format `key=value`, where `key` is the identifier used in the game code, and `value` is the translated text.
- **Encoding:** Use UTF-8 encoding for all language files to support special characters.
- **Testing:** After adding or editing translations, test the game thoroughly to ensure that all texts display correctly in the new or modified language.

By following these steps, you can seamlessly add new languages or update existing translations in the CRM game. 😊🌟
