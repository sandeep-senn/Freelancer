const AppLoader = ({ label = 'Loading...' }) => {
  return (
    <div className="min-h-[40vh] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-cyan-500 animate-spin" />
          <div className="absolute inset-[10px] rounded-full bg-blue-50" />
        </div>
        <div>
          <p className="text-base font-medium text-gray-700">{label}</p>
          <p className="text-sm text-gray-500">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
