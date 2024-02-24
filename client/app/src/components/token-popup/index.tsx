"use client"
import React, { useState } from 'react'

const TokenPopup = ({ onSubmit }) => {
    const [token, setToken] = useState('');

    const handleSubmit = () => {
        onSubmit(token);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Please enter your Jira API Token</h2>
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="border-2 border-gray-300 rounded p-2 w-full mb-4"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default TokenPopup;