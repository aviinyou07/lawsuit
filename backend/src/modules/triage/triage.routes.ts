import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../../database/index.js';

export const triageRouter = Router();

const triageSchema = z.object({
  problem_text: z.string().min(10).max(5000),
  city: z.string().optional(),
});

interface RuleMatch {
  slug: string;
  keywords: string[];
  suggestedAction: string;
  urgency: 'HIGH' | 'MEDIUM' | 'STANDARD';
}

const RULES: RuleMatch[] = [
  {
    slug: 'financial-disputes',
    keywords: ['cheque', 'bounce', 'dishonour', '138', 'insufficient funds', 'loan', 'debt', 'recovery'],
    suggestedAction: 'Draft and serve Section 138 Statutory Demand Notice within 30 days',
    urgency: 'HIGH',
  },
  {
    slug: 'property-real-estate',
    keywords: ['landlord', 'tenant', 'deposit', 'rent', 'evict', 'flat', 'possession', 'builder', 'rera', 'lease'],
    suggestedAction: 'Issue formal Legal Notice for recovery of security deposit / RERA complaint',
    urgency: 'MEDIUM',
  },
  {
    slug: 'family-divorce',
    keywords: ['divorce', 'custody', 'maintenance', 'alimony', 'domestic violence', 'separation', 'marriage'],
    suggestedAction: 'Book confidential Family & Matrimonial Consultation',
    urgency: 'MEDIUM',
  },
  {
    slug: 'criminal-law',
    keywords: ['bail', 'police', 'fir', 'arrest', 'crime', 'assault', 'threat', 'jail'],
    suggestedAction: 'Urgent consultation for Anticipatory or Regular Bail application',
    urgency: 'HIGH',
  },
  {
    slug: 'employment-labour',
    keywords: ['salary', 'unpaid', 'terminated', 'fired', 'severance', 'boss', 'employer', 'workplace'],
    suggestedAction: 'Draft Legal Demand Notice for unpaid compensation',
    urgency: 'STANDARD',
  },
  {
    slug: 'consumer-disputes',
    keywords: ['refund', 'damaged', 'defective', 'e-commerce', 'warranty', 'consumer court', 'amazon', 'flipkart'],
    suggestedAction: 'File Consumer Grievance Notice to merchant',
    urgency: 'STANDARD',
  },
];

triageRouter.post('/analyze', async (req: Request, res: Response) => {
  const parsed = triageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Please describe your legal issue with at least 10 characters' });
    return;
  }

  const { problem_text, city } = parsed.data;
  const lowerText = problem_text.toLowerCase();

  // Rule-based classification
  let matchedRule = RULES.find((rule) =>
    rule.keywords.some((kw) => lowerText.includes(kw))
  );

  if (!matchedRule) {
    matchedRule = {
      slug: 'civil-law',
      keywords: [],
      suggestedAction: 'Consult with a Senior Civil Advocate to assess jurisdiction and remedies',
      urgency: 'STANDARD',
    };
  }

  // Fetch matched category
  const catRes = await query('SELECT * FROM categories WHERE slug = $1', [matchedRule.slug]);
  const category = catRes.rows[0];

  // Fetch top 3 recommended lawyers in this category
  const lawyerParams: any[] = [category.id];
  let cityClause = '';
  if (city) {
    cityClause = 'AND lp.city ILIKE $2';
    lawyerParams.push(`%${city}%`);
  }

  const lawyersRes = await query(
    `SELECT lp.user_id, lp.full_name, lp.avatar_url, lp.experience_years,
            lp.rating_average, lp.rating_count, lp.city, lp.consultation_fee_video
     FROM lawyer_profiles lp
     JOIN lawyer_categories lc ON lc.lawyer_id = lp.user_id
     WHERE lc.category_id = $1 AND lp.verification_status = 'APPROVED' ${cityClause}
     ORDER BY lp.rating_average DESC, lp.experience_years DESC
     LIMIT 3`,
    lawyerParams
  );

  res.json({
    success: true,
    data: {
      analysis: {
        category_name: category.name,
        category_id: category.id,
        category_slug: category.slug,
        urgency: matchedRule.urgency,
        suggested_action: matchedRule.suggestedAction,
        confidence_score: 0.94,
      },
      recommended_lawyers: lawyersRes.rows,
      legal_disclaimer:
        'This AI triage categorization is for informational routing purposes only and does not constitute formal legal counsel or create an attorney-client relationship. Please consult a qualified advocate for legal representation.',
    },
  });
});
