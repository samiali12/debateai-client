export interface ArgumentType {
  type: string;
  debate_ai: boolean;
  debate_id: number;
  user_id: number;
  role: string;
  content: string;
  fullName: string;
  timestamp: Date;
  toxicity_score: number;
  civility_score: number;
  flag: string;
  temp_id: string;
  fairness_warning: false;
  toxicity_label: string;
  relevance_score: number;
  evidence_score: number;
  consistency_score: number;
  overall_strength: number;
}
