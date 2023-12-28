# Flask Recipe Server

## Introduction
This server uses Flask and LlamaCpp via the LangChain library to provide recipes for various foods.

## Prerequisites
- Python 3 (I am using the v3.9.6)

## Setup
1. Install: `pip install flask langchain Flask-WTF llama-cpp-python`
2. Download the LlamaCpp model (5.43GB) from [here](https://huggingface.co/TheBloke/Orca-2-13B-GGUF/blob/main/orca-2-13b.Q2_K.gguf) and place it in the same folder as your script.

## Running the Server
1. Run the command: `python server.py`.

## Usage 
(It's just one GET request on http://localhost:5000/get_recipe)

To fetch a recipe, use:
`curl "http://localhost:5000/get_recipe?food=[food item]"`

Replace `[food item]` with your desired food, e.g., `banana pancakes`.

`curl "http://localhost:5000/get_recipe?food=banana%pancakes"`

OBS - You may need to use 'pip3' (instead of 'pip') or 'python3' (instead of 'python') if either is not recognized. 

OBS2 - If you have GPUs, 'uncomment' line 14