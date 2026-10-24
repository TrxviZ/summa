import React, { useState } from 'react';
import './App.css'; // Assume Tailwind is configured here

export default function App() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', address: '', reason: '' });
  const [explanation, setExplanation] = useState('');

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });
      const data = await res.json();
      setPlan(data.plan);
      setStep(2);
    } catch (e) {
      alert("Ensure the backend and Ollama are running.");
    }
    setLoading(false);
  };

  const getExplanation = async (field) => {
    setExplanation("Thinking...");
    const res = await fetch('http://localhost:3001/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field })
    });
    const data = await res.json();
    setExplanation(data.explanation);
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-900 font-sans p-4 md:p-8">
      {/* ACCESSIBILITY HEADER */}
      <header className="max-w-4xl mx-auto mb-8 bg-blue-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Digital Divide Navigator</h1>
          <p className="text-xl mt-2 text-blue-100">Your simple guide to online forms.</p>
        </div>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-lg hidden md:block">
          🎤 Voice Mode
        </button>
      </header>

      <main className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-xl border-4 border-blue-900">
        {/* STEP 1: GOAL */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What are you trying to do today?</h2>
            <textarea 
              className="w-full text-2xl p-4 border-4 border-gray-300 rounded-xl focus:border-blue-600"
              rows="3"
              placeholder="Example: I need to update my address..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
            <button 
              onClick={generatePlan}
              disabled={loading}
              className="w-full bg-blue-700 text-white text-3xl font-bold py-6 rounded-xl hover:bg-blue-800 transition-colors"
            >
              {loading ? "Thinking..." : "Help Me With This"}
            </button>
          </div>
        )}

        {/* STEP 2: PLAN */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Here is our simple plan:</h2>
            <ol className="list-decimal list-inside space-y-4 text-2xl bg-blue-50 p-6 rounded-xl">
              {plan.map((s, i) => <li key={i} className="mb-2">{s}</li>)}
            </ol>
            <button 
              onClick={() => setStep(3)}
              className="w-full bg-green-600 text-white text-3xl font-bold py-6 rounded-xl hover:bg-green-700"
            >
              Let's Start Step 1
            </button>
          </div>
        )}

        {/* STEP 3: SMART FORM (Citizen Address Update Demo) */}
        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Citizen Address Update Service (Demo)</h2>
            
            {/* AI Explanation Box */}
            {explanation && (
              <div className="bg-yellow-200 border-l-8 border-yellow-500 p-4 rounded-r-xl">
                <p className="text-xl font-bold">🤖 AI Assistant:</p>
                <p className="text-2xl">{explanation}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold">Current Residential Address</span>
                  <button onClick={() => getExplanation("Current Residential Address")} className="text-blue-600 font-bold text-lg underline">Explain this</button>
                </label>
                <input type="text" className="w-full p-4 text-2xl border-2 border-gray-400 rounded-xl" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>

            <button 
              onClick={() => setStep(4)}
              className="w-full bg-blue-700 text-white text-3xl font-bold py-6 rounded-xl"
            >
              Check My Application
            </button>
          </div>
        )}

        {/* STEP 4 & 5: VALIDATION & CONFIRMATION */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Please review carefully</h2>
            <div className="bg-gray-100 p-6 rounded-xl text-2xl space-y-4 border-2 border-red-500">
              <p><strong>Address:</strong> {formData.address || <span className="text-red-600">Missing!</span>}</p>
              <p className="text-red-700 font-bold bg-red-100 p-4 rounded-lg mt-4">
                ⚠ IMPORTANT: Are you sure this information is correct? I am an AI assistant, I cannot verify this for you.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <button onClick={() => setStep(3)} className="flex-1 bg-gray-500 text-white text-2xl font-bold py-6 rounded-xl">
                Go Back and Edit
              </button>
              <button onClick={() => setStep(5)} className="flex-1 bg-green-600 text-white text-2xl font-bold py-6 rounded-xl">
                CONFIRM & SUBMIT
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-10 space-y-6">
            <h2 className="text-4xl font-bold text-green-700">🎉 Success!</h2>
            <p className="text-2xl">Your demo application was safely processed.</p>
            <button onClick={() => setStep(1)} className="bg-blue-600 text-white text-xl font-bold py-4 px-8 rounded-xl">Start New Task</button>
          </div>
        )}
      </main>
    </div>
  );
}