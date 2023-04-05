import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const maxTokens = 256
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const explainCode = async () => {
    if (!code) {
      setExplanation("コードを読み取りできませんでした");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: "system", content: "あなたはコードを説明するエキスパートです。" },
            { role: "user", content: `このプログラムのコードを${maxTokens}文字以内で説明してください:\n${code}` },
          ],
          max_tokens: maxTokens,
          n: 1,
          stop: null,
          temperature: 0.5,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const result = response.data.choices[0].message.content
      setExplanation(result || "コードを読み取りできませんでした");
    } catch (error) {
      setExplanation("エラーが発生しました");
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <textarea
        className="code-input"
        placeholder="コードを入力してください"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button className="explain-btn" onClick={explainCode}>
        コードを説明する
      </button>
      <div className="explanation">
        {loading ? "読み込み中" : explanation}
      </div>
    </div>
  );
}

export default App;
