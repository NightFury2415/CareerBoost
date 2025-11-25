"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function InterviewSetup({
  onStartInterview,
}: {
  onStartInterview: (config: any) => void;
}) {
  const [step, setStep] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string>("");

  const [config, setConfig] = useState({
    resume: "",
    position: "",
    experience: "",
    interviewType: "",
    timeLimit: "",
    jobDescription: "",
    company: "",
    voiceMode: false,
  });

  const [errors, setErrors] = useState<string[]>([]);

  const interviewTypes = [
    { value: "technical", label: "Technical Interview" },
    { value: "behavioral", label: "Behavioral Interview" },
    { value: "system-design", label: "System Design" },
    { value: "coding", label: "Coding Round" },
    { value: "mixed", label: "Mixed (All Types)" },
  ];

  const timeLimits = ["30 mins", "45 mins", "1 hour", "90 mins"];

  const validateStep = (currentStep: number) => {
    const newErrors: string[] = [];

    if (currentStep === 0) {
      if (!config.company.trim()) newErrors.push("Company name is required");
      if (!config.position.trim()) newErrors.push("Position name is required");
      if (!config.experience) newErrors.push("Years of experience is required");
      if (!config.interviewType) newErrors.push("Interview type is required");
    }

    if (currentStep === 1) {
      if (!config.jobDescription.trim())
        newErrors.push("Job description is required");
      if (!config.timeLimit) newErrors.push("Time limit is required");
      if (!resumeBase64)
        newErrors.push("Please upload your resume before continuing.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors([]);
  };

  const handleStart = () => {
    if (validateStep(step)) {
      onStartInterview({
        ...config,
        resume: resumeBase64,
      });
    }
  };


  const handleResumeUpload = async (file: File) => {
    setResumeFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setResumeBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-center gap-8 mb-4">
          {[0, 1].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  s <= step
                    ? "bg-cyan-500 text-black"
                    : "bg-slate-700 text-gray-300"
                }`}
              >
                {s + 1}
              </div>
              <span className="text-sm mt-2 text-gray-300 font-medium">
                {s === 0 ? "Basic Info" : "Final Details"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {errors.length > 0 && (
        <Alert className="bg-red-900/20 border-red-800 mb-6">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            {errors.map((error, idx) => (
              <div key={idx}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* STEP 0 - Basic Info */}
      {step === 0 && (
        <Card className="bg-slate-800/50 border-slate-700 p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Basic Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Company Name
              </label>
              <Input
                placeholder="e.g., Google, Amazon, Meta"
                value={config.company}
                onChange={(e) =>
                  setConfig({ ...config, company: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                The AI will tailor questions to this company
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Position Name
              </label>
              <Input
                placeholder="e.g., Senior Software Engineer"
                value={config.position}
                onChange={(e) =>
                  setConfig({ ...config, position: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Years of Experience
              </label>
              <Select
                value={config.experience}
                onValueChange={(value) =>
                  setConfig({ ...config, experience: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select years of experience" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {["0-1", "1-3", "3-5", "5-7", "7-10", "10+"].map((range) => (
                    <SelectItem
                      key={range}
                      value={range}
                      className="text-white hover:bg-slate-600"
                    >
                      {range} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Interview Type
              </label>
              <Select
                value={config.interviewType}
                onValueChange={(value) =>
                  setConfig({ ...config, interviewType: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {interviewTypes.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="text-white hover:bg-slate-600"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              onClick={handleNext}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
            >
              Next
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 1 - Final Details */}
      {step === 1 && (
        <Card className="bg-slate-800/50 border-slate-700 p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Final Details
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Job Description
              </label>
              <Textarea
                placeholder="Paste the job description here..."
                value={config.jobDescription}
                onChange={(e) =>
                  setConfig({ ...config, jobDescription: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white min-h-32"
              />
              <p className="text-xs text-gray-400 mt-1">
                This helps the AI tailor questions to the specific role
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Time Limit
              </label>
              <Select
                value={config.timeLimit}
                onValueChange={(value) =>
                  setConfig({ ...config, timeLimit: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select time limit" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {timeLimits.map((time) => (
                    <SelectItem
                      key={time}
                      value={time}
                      className="text-white hover:bg-slate-600"
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Upload Your Resume (PDF)
              </label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  e.target.files && handleResumeUpload(e.target.files[0])
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
              {resumeFile && (
                <p className="text-gray-300 mt-2 text-sm">
                  ✓ Uploaded: {resumeFile.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Checkbox
                checked={config.voiceMode}
                onCheckedChange={(val) =>
                  setConfig({ ...config, voiceMode: Boolean(val) })
                }
                id="voiceMode"
                className="border-slate-500"
              />
              <label
                htmlFor="voiceMode"
                className="text-gray-300 cursor-pointer"
              >
                Enable Voice Mode (Speech-to-Text + Text-to-Speech)
              </label>
            </div>
          </div>

          <div className="flex justify-between gap-3 mt-8">
            <Button
              onClick={handleBack}
              variant="outline"
              className="text-gray-300 bg-transparent hover:bg-slate-700"
            >
              Back
            </Button>
            <Button
              onClick={handleStart}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
            >
              Start Interview
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
