import { Box, LinearProgress, Rating } from '@mui/material'

const ratingRows = [
  { label: 'Excellent', value: 40, color: '#C8A24A' },
  { label: 'Very Good', value: 30, color: '#C8A24A' },
  { label: 'Good',      value: 25, color: '#D8B56A' },
  { label: 'Average',   value: 21, color: '#D8B56A' },
  { label: 'Poor',      value: 10, color: '#888' },
]

const RatingCard = ({totalReview}: any) => {
  return (
    <div className="border border-[#C8A24A]/15 p-6 rounded-none bg-white/60">
      <div className="flex items-center gap-3 pb-6">
        <Rating name="read-only" value={4.6} precision={0.5} readOnly
          sx={{ "& .MuiRating-iconFilled": { color: "#C8A24A" } }}
        />
        <p className="font-sans text-xs text-charcoal/60 tracking-wider">{totalReview} Ratings</p>
      </div>
      <Box className="space-y-3">
        {ratingRows.map((row) => (
          <div key={row.label} className="flex items-center gap-4">
            <p className="font-sans text-xs w-20 text-charcoal/70 shrink-0">{row.label}</p>
            <div className="flex-1">
              <LinearProgress
                sx={{
                  bgcolor: '#f0ede4',
                  borderRadius: 0,
                  height: 5,
                  '& .MuiLinearProgress-bar': { bgcolor: row.color }
                }}
                variant="determinate"
                value={row.value}
              />
            </div>
            <p className="font-sans text-xs w-10 text-right text-charcoal/50 shrink-0">
              {Math.round((row.value / 100) * 19259).toLocaleString()}
            </p>
          </div>
        ))}
      </Box>
    </div>
  )
}

export default RatingCard