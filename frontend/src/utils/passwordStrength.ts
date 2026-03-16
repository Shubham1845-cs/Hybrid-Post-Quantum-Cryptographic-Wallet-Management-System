// return a score from the 0 to 5 
export interface StrengthResult
{
   score: number;        // 0 to 5
  label: string;        // "Weak", "Fair", "Strong", "Very Strong"
  color: string;        // tailwind bg class for the bar
  textColor: string;    // tailwind text class for the label
  percent: number;      // 0 to 100 for bar width
}

export const getPasswordStrength=(pwd:string):StrengthResult=>
{
    let score=0;
    if(pwd.length>=8) score++;
    if(pwd.length>=12) score++;
    if(/[A-Z]/.test(pwd))  score++;
    if(/[0-9]/.test(pwd))  score++;
    if(/[^A-Za-z0-9]/.test(pwd)) score++;

    if(score===0)
    {
        return{
            score,label:'Too Short',percent:0,
            color: 'bg-slate-700', textColor: 'text-slate-500',
        };
    }
    if (score === 1) return {
    score, label: 'Weak', percent: 20,
    color: 'bg-red-500', textColor: 'text-red-400',
  };
  if (score === 2) return {
    score, label: 'Fair', percent: 40,
    color: 'bg-orange-500', textColor: 'text-orange-400',
  };
  if (score === 3) return {
    score, label: 'Good', percent: 60,
    color: 'bg-yellow-500', textColor: 'text-yellow-400',
  };
  if (score === 4) return {
    score, label: 'Strong', percent: 80,
    color: 'bg-emerald-500', textColor: 'text-emerald-400',
  };
  return {
    score, label: 'Very Strong', percent: 100,
    color: 'bg-violet-500', textColor: 'text-violet-400',
  };
}