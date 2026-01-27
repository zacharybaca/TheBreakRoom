import SupportTicket from "../models/SupportTicket.js";

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
export const createTicket = async (req, res, next) => {
  try {
    const { subject, message, category } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const ticket = await SupportTicket.create({
      user: req.user._id,
      subject,
      message,
      category,
    });

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all tickets (Admin only)
// @route   GET /api/support
// @access  Private/Admin
export const getTickets = async (req, res, next) => {
  try {
    // Filter by status if provided in query (e.g. ?status=Open)
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tickets = await SupportTicket.find(filter)
      .populate("user", "name username email avatarUrl")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(tickets);
  } catch (err) {
    next(err);
  }
};

// @desc    Get my tickets (User)
// @route   GET /api/support/me
// @access  Private
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(tickets);
  } catch (err) {
    next(err);
  }
};

// @desc    Update ticket status/reply (Admin only)
// @route   PUT /api/support/:id
// @access  Private/Admin
export const updateTicket = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (status) ticket.status = status;
    if (adminResponse) ticket.adminResponse = adminResponse;

    await ticket.save();

    res.status(200).json({ message: "Ticket updated", ticket });
  } catch (err) {
    next(err);
  }
};
