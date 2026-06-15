import { PawOutline, PawSolid } from '../icons';

/*
  PawRating
  官方評分顯示元件 — 使用 icon_review_outline / icon_review_solid
  滿分固定 5 爪，依 rating（0-5）顯示實心 / 空心爪印。

  用於：HotelCard、HotelCardRow、detail page 等所有顯示
  「官方 PawGuide 評分」的位置。
*/
export default function PawRating({ rating = 0, size = 14, showNumber = true, gap = 2 }) {
  const filled = Math.round(Number(rating) || 0);
  const paws = Array.from({ length: 5 }, (_, i) => i < filled);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: showNumber ? 6 : 0 }}>
      <span style={{ display: 'inline-flex', gap }}>
        {paws.map((isFilled, i) => (
          isFilled
            ? <PawSolid key={i} size={size} color="var(--green-dark)" />
            : <PawOutline key={i} size={size} color="var(--border)" />
        ))}
      </span>
      {showNumber && (
        <strong style={{ fontSize: size - 1, fontWeight: 700, color: 'var(--text-dark)' }}>
          {rating || '—'}
        </strong>
      )}
    </span>
  );
}
