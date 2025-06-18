public class AuthService
{
    private readonly IConfiguration _configuration;
    private readonly string _connectionString;

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;
        _connectionString = _configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<User> Register(User user, string password)
    {
        CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;

        using (var connection = new SqlConnection(_connectionString))
        {
            await connection.ExecuteAsync(
                "INSERT INTO Users (Username, Email, PasswordHash, PasswordSalt) VALUES (@Username, @Email, @PasswordHash, @PasswordSalt)",
                user);
        }

        return user;
    }

    public async Task<string> Login(string username, string password)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var user = await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Username = @username", new { username });

            if (user == null || !VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return GenerateJwtToken(user);
        }
    }

    private string GenerateJwtToken(User user)
    {
        // JWT token generation logic
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        // Password hashing logic
    }

    private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
    {
        // Password verification logic
    }
}