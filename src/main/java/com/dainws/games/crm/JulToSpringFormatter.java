package com.dainws.games.crm;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Formatter;
import java.util.logging.LogRecord;

public class JulToSpringFormatter extends Formatter {
    private static final String PATTERN = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";

    @Override
    public String format(LogRecord record) {
        String timestamp = new SimpleDateFormat(PATTERN).format(new Date(record.getMillis()));
        String level = record.getLevel().getName();
        String loggerName = record.getLoggerName();
        String threadName = Thread.currentThread().getName();
        String message = formatMessage(record);
        return String.format("%s %-5s [%s] %s : %s%n", timestamp, level, threadName, loggerName, message);
    }
}
