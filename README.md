# Keativ 🌍

**AI Language Tool for Multilingual Creators**

Keativ is a powerful, offline-capable AI language tool designed for content creators, students, and professionals working with multiple languages. It combines translation, language learning, and content generation into one seamless experience.

## ✨ Key Features

### Multilingual Support
- **36 Languages**: Broad language coverage including English, Spanish, French, Arabic, Chinese, Swahili, and many more.
- **Dual-Mode Translation**: Toggle between **Translation Mode** (accurate, context-aware translation) and **Creative Mode** (imaginative, adaptive content generation).
- **Code Intelligence**: Built-in support for **GitHub Copilot** style code generation and completion.

### Advanced AI Capabilities
- **Content Generation**: Create articles, marketing copy, social media posts, and creative stories.
- **Language Learning**: Practice conversation, get explanations, and understand grammar with AI guidance.
- **Code Generation**: Generate code snippets, debug, and understand programming concepts.
- **Summarization**: Condense long documents into concise summaries.

### Privacy & Control
- **Fully Local**: Run the model entirely on your own device for maximum privacy.
- **Offline Capable**: No internet connection required after initial model download.
- **Open Source Foundation**: Built on the innovative **Qwen3-8B-Instruct-4bit** model.

## 🚀 Quick Start

### Prerequisites
- **Operating System**: Windows 10/11, macOS, or Linux
- **RAM**: 8GB+ recommended (16GB+ for optimal performance)
- **Disk Space**: ~6GB for the model

### Installation

**Option 1: Using Prebuilt Executable**

[Keativ](https://drive.google.com/file/d/17Y0X-d5q8HhR5uFv1tG917u2n5p0r0tL/view?usp=sharing)

**Option 2: Building from Source**

```bash
# Clone the repository
git clone https://github.com/Byukusenge-Andrew/keativ.git
cd keativ

# Install dependencies
pip install -r requirements.txt

# Run the application
python src/main.py
```

## 🛠️ Usage

### Running the App

```bash
# Start the main interface
python src/main.py

# Start the chatbot interface
python src/chatbot.py
```

### Model Management

Download the Qwen3-8B-Instruct-4bit model:

```bash
# Download Qwen3-8B model
./download_model.sh Qwen3-8B
```

## 🎯 Usage Modes

### 1. Translation Mode
- Select source and target languages
- Enter text to translate
- Get accurate, context-aware translations

### 2. Creative Mode
- Great for content creation and brainstorming
- Generates creative, adaptive content
- Perfect for marketing, social media, and writing

### 3. Code Mode
- Write or generate code snippets
- Get explanations and debugging help
- Supports multiple programming languages

### 4. Chat Mode
- Open-ended conversation with the AI
- Use for learning, Q&A, or practice

## 🧩 Architecture

- **Frontend**: Streamlit UI with modern design
- **AI Runtime**: Local Llama.cpp with Qwen3-8B model
- **Performance**: Optimized for Windows/Linux/Mac
- **Language**: Python 3.12

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.

## 📧 Contact

**Andrew Byukusenge** - [andrebyukusenge9@gmail.com](mailto:[EMAIL_ADDRESS])
**GitHub**: [github.com/Byukusenge-Andrew](https://github.com/Byukusenge-Andrew)
