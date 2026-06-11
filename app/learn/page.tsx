export default function LearnPage() {
  return (
    <div className="container stack-lg">
      <section className="panel stack-md">
        <p className="eyebrow">How this project is organized</p>
        <h1>Learn the moving parts</h1>
        <p>
          This starter keeps the quiz logic in a small schema file, keeps scoring in a separate utility,
          and keeps the user interface in one client component. That separation is what makes future edits
          easier.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>File map</h2>
        <div className="stack-sm">
          <div>
            <strong>app/page.tsx</strong>
            <p className="muted">The route for the main quiz page.</p>
          </div>
          <div>
            <strong>components/quiz-app.tsx</strong>
            <p className="muted">Interactive React component that renders questions and results.</p>
          </div>
          <div>
            <strong>lib/quiz-schema.ts</strong>
            <p className="muted">Question content, answer options, and branching metadata.</p>
          </div>
          <div>
            <strong>lib/scoring.ts</strong>
            <p className="muted">Reverse scoring, family classification, and modifier logic.</p>
          </div>
        </div>
      </section>

      <section className="panel stack-md">
        <h2>Why schema-driven matters</h2>
        <p>
          A schema-driven quiz means you can add or rewrite questions without rewriting the whole interface.
          When you move to bigger projects, that same pattern helps with surveys, onboarding flows, and
          recommendation tools.
        </p>
      </section>
    </div>
  )
}
