import { Request, Response, NextFunction } from 'express';

export const aiController = {
  handleChatQuery: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message } = req.body;
      const lowerMsg = message.toLowerCase();
      
      let type = 'text';
      let text = 'I am not sure how to help with that. Try asking me about "missing parts" or "budget alerts".';
      let payload: any = null;

      // Intent Matching
      if (lowerMsg.includes('missing') || lowerMsg.includes('shortage')) {
        type = 'missing_parts';
        text = 'Here are the upcoming critical shortages affecting planned maintenance:';
        // Mock data similar to Joule's screenshot
        payload = [
          { maintenance: 'REPLACE PUMP-01 - MONTHLY', partDescription: 'PUMP-02', week: 'CW08 2026' },
          { maintenance: 'INSPECT CRUSHER-01 - MONTHLY', partDescription: 'PUMP-02', week: 'CW10 2026' },
          { maintenance: 'INSPECT CRUSHER-02 - QUARTERLY', partDescription: 'VALVE-02', week: 'CW11 2026' },
        ];
      } else if (lowerMsg.includes('budget') || lowerMsg.includes('cost') || lowerMsg.includes('finance')) {
        type = 'budget_alerts';
        text = 'I found the following budget warnings for the upcoming months:';
        payload = [
          { location: 'OPERATIONSITE1', month: 'Jul-26', projectedCost: '$199k', status: 'Warning' },
          { location: 'GLOBAL_DISTRIBUTION', month: 'Jun-26', projectedCost: '$321k', status: 'Critical' },
        ];
      } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        text = 'Hello! I am AssetIQ, your smart maintenance assistant. How can I help you today?';
      } else if (lowerMsg.includes('work order') || lowerMsg.includes('status')) {
        type = 'work_order_status';
        text = 'Here is the status of recent high-priority work orders:';
        payload = [
          { id: 'WO-10045', title: 'Conveyor Belt Fix', status: 'IN_PROGRESS' },
          { id: 'WO-10046', title: 'HVAC Filter Replacement', status: 'COMPLETED' }
        ];
      }

      // Simulate a small delay for "AI thinking"
      setTimeout(() => {
        res.json({
          success: true,
          data: { type, text, payload }
        });
      }, 1000);

    } catch (error) {
      next(error);
    }
  }
};
