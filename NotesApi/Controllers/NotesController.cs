[Authorize]
[ApiController]
[Route("[controller]")]
public class NotesController : ControllerBase
{
    private readonly NoteService _noteService;

    public NotesController(NoteService noteService)
    {
        _noteService = noteService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _noteService.GetAllNotes());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var note = await _noteService.GetNoteById(id);
        if (note == null) return NotFound();
        return Ok(note);
    }

    [HttpPost]
    public async Task<IActionResult> Create(NoteCreateDto noteDto)
    {
        var note = new Note { Title = noteDto.Title, Content = noteDto.Content };
        var createdNote = await _noteService.CreateNote(note);
        return CreatedAtAction(nameof(GetById), new { id = createdNote.Id }, createdNote);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, NoteUpdateDto noteDto)
    {
        var note = new Note { Id = id, Title = noteDto.Title, Content = noteDto.Content };
        await _noteService.UpdateNote(note);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _noteService.DeleteNote(id);
        return NoContent();
    }
}