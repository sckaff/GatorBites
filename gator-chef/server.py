from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.llms import LlamaCpp
from flask_wtf.csrf import CSRFProtect
import re

app = Flask(__name__)

CORS(app)  # This will allow CORS for all routes and methods

csrf = CSRFProtect()
csrf.init_app(app)
callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])

llm = LlamaCpp(
    model_path="orca-2-13b.Q2_K.gguf",
    n_ctx=5000,
    n_batch=32,
    max_tokens=512,  # Adjust as needed
    n_gpu_layers=2,  # Uncomment if using 2 GPUs
    f16_kv=True,  # Essential for memory efficiency
    callback_manager=callback_manager,
    stop=["[/ANSWER]", "\n\n\n", "(((((", "11111", "0000"],
    verbose=True
)

def validate_food_input(food):
    if not re.match("^[a-zA-Z0-9 ]*$", food):
        return False
    return True

def get_output(food):
    output = llm("""
[QUESTION]
You are a personal assistant and a professional chef who knows all the recipes.
Here is your task: Share with us the perfect recipe to make {}.
Answer with the name of the recipe and a brief description, the recipe ingredients, and a step-by-step on how to make it.
Be concise and answer in plain text. Start your answer with the [ANSWER] tag and end with the [/ANSWER] tag.
[/QUESTION]
""".format(food))

    if '[ANSWER]' in output:
        return output[output.index('[ANSWER]')+ 9:]
    else:
        return output

@app.route('/get_recipe', methods=['GET'])
def get_recipe():
    food = request.args.get('food', default='', type=str)
    if not food:
        return jsonify({"error": "No food specified"}), 400

    if not validate_food_input(food):
        return jsonify({"error": "Invalid input"}), 400

    try:
        recipe_output = get_output(food)
        return jsonify({"recipe": recipe_output})
    except Exception as e:
        return jsonify({"error": "An error occurred processing your request"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
