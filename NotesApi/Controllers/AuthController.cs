[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegistrationDto request)
    {
        var user = new User { Username = request.Username, Email = request.Email };
        await _authService.Register(user, request.Password);
        
        return Ok(new { message = "Registration successful" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto request)
    {
        var token = await _authService.Login(request.Username, request.Password);
        
        if (token == null)
            return Unauthorized();
            
        return Ok(new { token });
    }
}