package com.cgi.library.controller;

import com.cgi.library.model.BookDTO;
import com.cgi.library.model.BookStatus;
import com.cgi.library.service.BookService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/book")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping(value = "getBooks")
    public ResponseEntity<Page<BookDTO>> getBooks(@RequestParam(value = "status") Optional<BookStatus> status,
                                                  Pageable pageable) {
        if (status.isEmpty()) {
            return ResponseEntity.ok(bookService.getBooks(pageable));
        } else {
            return ResponseEntity.ok(bookService.getBooksByStatus(status.get(), pageable));
        }
    }

    @GetMapping(value = "getBook")
    public ResponseEntity<BookDTO> getBook(@RequestParam(value = "bookId") UUID bookId) {
        return ResponseEntity.ok(bookService.getBook(bookId));
    }

    @PostMapping(value = "saveBook")
    public ResponseEntity<String> saveBook(@RequestBody BookDTO book) {
        bookService.saveBook(book);
        return ResponseEntity.ok("");
    }

    @DeleteMapping(value = "deleteBook")
    public ResponseEntity<String> deleteBook(@RequestParam(value = "bookId") UUID bookId) {
        try {
            bookService.deleteBook(bookId);
            return ResponseEntity.ok("");
        } catch (Exception exception) {
            if (exception.getCause() instanceof ConstraintViolationException) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        "Cannot delete book, which has connected checkouts");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
            }
        }
    }

    @GetMapping(value = "search")
    public ResponseEntity<Page<BookDTO>> getBook(@RequestParam(value = "term") String searchTerm, Pageable pageable) {
        return ResponseEntity.ok(bookService.searchFreeText(searchTerm, pageable));
    }
}
