---
description: Analyze code submissions from candidates. Triggers on "analyze this code", "review this solution", "evaluate code submission", "grade this code challenge".
---

# Analyze Code Challenge Submission

Review and evaluate candidate code solutions with detailed feedback. Compare against reference solutions and identify strengths and improvements.

## Analysis Dimensions

Evaluate code across these key areas:

### 1. Correctness
- Does it solve the problem correctly?
- Handles edge cases (null, empty, large inputs)?
- Works for all expected test cases?
- Avoids obvious bugs or runtime errors?

### 2. Code Quality & Style
- Clean, readable variable/function names
- Proper indentation and formatting
- Logical organization and structure
- Comments where needed (but not excessive)
- Follows language conventions

### 3. Efficiency
- Time complexity (O notation)
- Space complexity
- Unnecessary loops or redundant operations
- Appropriate data structures used
- Could optimize further?

### 4. Best Practices
- Error handling and validation
- SOLID principles (if applicable)
- DRY (Don't Repeat Yourself)
- Appropriate abstractions
- Language idioms and patterns

### 5. Problem-Solving Approach
- Did candidate understand problem fully?
- Asked clarifying questions?
- Explained approach before coding?
- Considered trade-offs?
- Iteratively improved solution?

## Evaluation Report Format

```
CODE CHALLENGE ANALYSIS
═══════════════════════════════════════

CANDIDATE: [Name]
DATE: [Date]
CHALLENGE: [Problem Title]
LANGUAGE: [JavaScript/Python/etc]

SOLUTION SUMMARY
──────────────────────────────────────
[Brief description of what their solution does]

CORRECTNESS: [PASS / PARTIAL / FAIL]
- [Specific test cases or edge cases covered]
- [Any failures or corner cases missed]

CODE QUALITY: [EXCELLENT / GOOD / FAIR / POOR]
- Readability: [comment]
- Naming conventions: [comment]
- Organization: [comment]

EFFICIENCY ANALYSIS
──────────────────────────────────────
Time Complexity:  [O(n), O(n²), etc]
Space Complexity: [O(1), O(n), etc]
- Is this optimal for the problem?
- Could be improved by: [suggestions]

COMPARISON TO REFERENCE SOLUTION
──────────────────────────────────────
[How their solution differs from expected approach]
[Advantages of their approach vs. reference]
[Disadvantages or missed optimizations]

STRENGTHS
──────────────────────────────────────
✓ [Key strength 1 with example]
✓ [Key strength 2]
✓ [Key strength 3]

AREAS FOR IMPROVEMENT
──────────────────────────────────────
→ [Missing edge case handling]
→ [Could optimize by...]
→ [Better approach would be...]
→ [Code could be cleaner if...]

OVERALL SCORE: [X]/100

FEEDBACK FOR CANDIDATE
──────────────────────────────────────
[Constructive, encouraging feedback]
[What they did well]
[One specific thing to work on]
```

## Scoring Breakdown

**90-100**: Correct, clean, efficient - production-ready code
**80-89**: Correct with minor issues - strong fundamentals
**70-79**: Mostly correct, some inefficiencies or style issues
**60-69**: Works but has bugs or significant efficiency problems
**50-59**: Partially working, fundamental approach issues
**Below 50**: Incorrect or incomplete solution

## Optimization Questions to Ask

When analyzing, consider:
- "How would you optimize for very large inputs?"
- "What if the problem constraints changed to X?"
- "How would you make this more maintainable?"
- "What's the bottleneck in your solution?"
- "How would you test this code?"

## Best Practices Checklist

- ✓ Input validation
- ✓ Edge case handling
- ✓ Clear variable names
- ✓ Appropriate comments
- ✓ Efficient algorithm choice
- ✓ Good error handling
- ✓ No code duplication
- ✓ Proper use of language features
