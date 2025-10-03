export const ErrorMessage = ({ message }) => (
    <div className="my-10 p-4 bg-red-900/50 border border-red-500 rounded-lg text-center max-w-3xl mx-auto">
      <p className="font-bold text-red-300">An Error Occurred</p>
      <p className="text-red-400 mt-1">{message}</p>
    </div>
  );