namespace Domain.Common.Telegram.Interfaces
{
    public interface ITelegramServices
    {
        Task<bool> SendMessage(string message, string Message_Thread_ID);
    }
}
