export interface Flow {
  steps: Step[];
}

interface Step {
  id: number;
  index: number;
  message: string;
  parent?: number;
}
