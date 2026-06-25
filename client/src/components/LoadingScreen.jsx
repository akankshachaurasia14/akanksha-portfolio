export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-terminal">
        <span className="term-prompt">$</span>
        <span>loading_profile.exe</span>
        <span className="term-cursor" aria-hidden="true">▌</span>
      </div>
    </div>
  )
}
