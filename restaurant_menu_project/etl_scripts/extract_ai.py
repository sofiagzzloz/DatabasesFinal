import openai
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the OpenAI API key from the environment
openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai.api_key:
    raise ValueError("OpenAI API key is not configured")

def process_text_with_ai(text):
    """
    Sends raw menu text to OpenAI API and receives structured JSON data.
    :param text: Extracted raw menu text.
    :return: JSON dictionary of structured data (only menu data).
    """
    try:
        # Define the prompt with JSON schema, focusing only on the menu data (no version or restaurant data)
        prompt = f"""
            Parse this menu text into JSON with sections, items, prices, and dietary tags. 
            For fields like price, currency, calories, or spice_level, if any of them are missing or unclear, set them to null.
            Ensure that all fields are well-structured, and translate any Spanish text into English.

        {text}

        Ensure the following JSON schema is followed:

        {{
            "sections": [
                {{
                    "name": "string",
                    "description": "string",
                    "display_order": "integer",
                    "menu_items": [
                        {{
                            "name": "string",
                            "description": "string",
                            "price": "number",
                            "currency": "string",
                            "calories": "integer",
                            "spice_level": "integer",
                            "is_available": "boolean",
                            "display_order": "integer",
                            "dietary_restrictions": ["string"]
                        }}
                    ]
                }}
            ]
        }}
        """

        # Use OpenAI's chat completion API for processing (correct endpoint and model)
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # Correct model name for chat completions
            messages=[
                {"role": "system", "content": "parse menu text into a structured JSON format"},
                {"role": "user", "content": prompt}
            ]
        )

        # Debugging: Print the response type and attributes
        print("Raw response type:", type(response))
        print("Response attributes:", dir(response))  # Print the attributes of the response

        # Check if 'choices' exist in the response and handle them
        if hasattr(response, 'choices') and len(response.choices) > 0:
            # Access the message content from the 'choices' array correctly
            content = response.choices[0].message.content.strip()  # Access content in the message

            # Remove the "```json" code block markdown if present
            if content.startswith("```json") and content.endswith("```"):
                content = content[7:-3].strip()  # Remove the markdown block

            # Debugging: Print the cleaned content before parsing
            print("Cleaned content received from OpenAI:", content)

            # Try to parse the response as JSON
            try:
                menu_json = json.loads(content)
                return menu_json
            except json.JSONDecodeError:
                print("Error parsing structured data into JSON.")
                return None
        else:
            print("No valid 'choices' found in the response.")
            return None

    except Exception as e:
        print(f"Error processing text with AI: {e}")
        return None
