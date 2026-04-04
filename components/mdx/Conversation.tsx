interface ConversationItem {
  speaker: string;
  avatar: string;
  message: string;
}

interface ConversationProps {
  items: ConversationItem[];
}

export function Conversation({ items }: ConversationProps) {
  return (
    <div className="space-y-6 my-8">
      {items.map((item, index) => {
        const isCoach = item.speaker === 'コーチ';
        return (
          <div
            key={index}
            className={`flex gap-4 ${isCoach ? '' : 'flex-row-reverse'}`}
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                {item.avatar}
              </div>
            </div>
            <div className={`flex-1 ${isCoach ? '' : 'text-right'}`}>
              <div className="font-semibold text-sm text-gray-600 mb-1">
                {item.speaker}
              </div>
              <div
                className={`inline-block px-4 py-3 rounded-lg ${
                  isCoach
                    ? 'bg-blue-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {item.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
