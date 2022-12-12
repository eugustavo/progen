export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',

        alignItems: 'center',
        justifyContent: 'center',

        flexDirection: 'column',
      }}
    >
      <h3>Project created from the CLI</h3>
      <div
        style={{
          padding: 10,
          fontStyle: 'italic',
          backgroundColor: '#f5e5b9',
          borderRadius: 8,
        }}
      >
        <span>
          npx @eugustavo/progen
        </span>
      </div>
    </div>
  )
}
