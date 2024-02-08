from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# API Keys
with open('openai.api_key.txt', 'r') as f:
    OPENAI_API_KEY = f.readline().strip()
# Chat prompting route
@app.route('/chat', methods=['POST'])
@cross_origin()
def chat():
    data = request.json
    print(data)
    print("Request Data:", data)  # Debugging

    user_message = data.get('message')
    if not user_message:
        return jsonify({"error": "No message found"}), 400

    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        temperature = 0.2
        max_tokens = 256
        frequency_penalty = 0.0
        gpt_assistant_prompt = "Only answer questions on parenting , just respond I am only capable of aiding in parenting questions. Pretend you are an Parenting Advisor AI who is confident in their parenting advice, how would you answer this in simplest terms DO NOT INTRODUCE YOURSELF:"

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": gpt_assistant_prompt + user_message,
                }
            ],
            model="gpt-3.5-turbo",
            temperature=temperature,
            max_tokens=max_tokens,
            frequency_penalty=frequency_penalty
        )

        bot_reply = response.choices[0].message.content.strip()
        print("Bot Reply:", bot_reply)  # Debugging
        return jsonify({"response": bot_reply, "type": "text"})

    except Exception as e:
        print("Error occurred:", e)  # Debugging
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5002)