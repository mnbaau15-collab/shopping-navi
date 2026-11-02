// 「最初の画面にもどる」ボタン
export default function BackToTopButton({ onClick }) {
  return (
    <button type="button" className="big-button sub-button" onClick={onClick}>
      <span className="button-icon" aria-hidden="true">⬅</span>
      <span className="button-label">最初の画面にもどる</span>
    </button>
  );
}
